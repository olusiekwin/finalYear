"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiUrl } from "@/lib/api";

interface IssuedBy {
  first_name?: string;
  last_name?: string;
}

interface Prescription {
  _id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  duration: number;
  issued_date: string;
  issued_by?: IssuedBy;
}

interface Order {
  _id: string;
  prescription_id: string;
  order_status: string;
  delivery_method: string;
  total_price: number;
  created_at: string;
}

export default function PharmacyPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"prescriptions" | "orders">("prescriptions");
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState("pickup");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        if (tab === "prescriptions") {
          const response = await fetch(
            apiUrl("/pharmacy/my-prescriptions"),
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          if (!response.ok) {
            throw new Error("Failed to fetch prescriptions");
          }

          const data = await response.json();
          setPrescriptions(data.prescriptions || []);
        }

        if (tab === "orders") {
          const response = await fetch(
            apiUrl("/pharmacy/my-orders"),
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          if (!response.ok) {
            throw new Error("Failed to fetch orders");
          }

          const data = await response.json();
          setOrders(data.orders || []);
        }
      } catch {
        setError(`Error loading ${tab}`);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [tab, token, router]);

  const refreshOrders = async () => {
    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        apiUrl("/pharmacy/my-orders"),
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch {
      setError("Error refreshing orders");
    }
  };

  const handleCreateOrder = async () => {
    if (!selectedPrescription || !token) {
      return;
    }

    if (deliveryMethod === "delivery" && !deliveryAddress) {
      setError("Please enter delivery address");
      return;
    }

    setIsCreatingOrder(true);

    try {
      const response = await fetch(
        apiUrl("/pharmacy/order/create"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            prescription_id: selectedPrescription._id,
            delivery_method: deliveryMethod,
            delivery_address:
              deliveryMethod === "delivery" ? deliveryAddress : null,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      setSelectedPrescription(null);
      setDeliveryAddress("");
      setTab("orders");
      await refreshOrders();
    } catch {
      setError("Error creating order");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handlePaymentOrder = async (orderId: string) => {
    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        apiUrl(`/pharmacy/order/${orderId}/pay`),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            phoneNumber: localStorage.getItem("phoneNumber") || "",
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Payment initiation failed");
      }

      await refreshOrders();
    } catch {
      setError("Error initiating payment");
    }
  };

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-sm border border-[#2a4540]/12 bg-gradient-to-r from-[#2f4b45] to-[#355a53] p-8 text-white sm:p-10">
          <Link
            href="/dashboard"
            className="text-xs font-bold uppercase tracking-[0.22em] text-[#e4c9ba]"
          >
            Back to Dashboard
          </Link>
          <h1 className="mt-3 font-display text-5xl font-semibold">
            Pharmacy Flow
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[#eaded5]">
            Manage prescription orders and delivery workflow in one place.
          </p>
        </section>

        {error && (
          <div className="mt-6 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-7 flex gap-2 rounded-sm border border-[#2a4540]/10 bg-[#f8fcfb] p-2">
          <button
            onClick={() => setTab("prescriptions")}
            className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider ${
              tab === "prescriptions"
                ? "bg-[#2f4b45] text-white"
                : "text-[#6d5f55]"
            }`}
          >
            Prescriptions
          </button>
          <button
            onClick={() => setTab("orders")}
            className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider ${
              tab === "orders" ? "bg-[#2f4b45] text-white" : "text-[#6d5f55]"
            }`}
          >
            Orders
          </button>
        </div>

        {isLoading ? (
          <div className="mt-8 flex items-center justify-center py-10">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#2a4540]/18 border-t-[#2f4b45]" />
          </div>
        ) : (
          <section className="mt-7">
            {tab === "prescriptions" &&
              (prescriptions.length === 0 ? (
                <EmptyState text="No prescriptions available" />
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {prescriptions.map((rx) => (
                    <article
                      key={rx._id}
                      className="rounded-sm border border-[#2a4540]/10 bg-white p-5"
                    >
                      <h3 className="text-lg font-semibold text-[#2d423c]">
                        {rx.medication_name}
                      </h3>
                      <div className="mt-2 space-y-1 text-sm text-[#665b53]">
                        <p>Dosage: {rx.dosage}</p>
                        <p>Frequency: {rx.frequency}</p>
                        <p>Duration: {rx.duration} days</p>
                        <p>
                          Issued by: {rx.issued_by?.first_name || "Doctor"}{" "}
                          {rx.issued_by?.last_name || ""}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedPrescription(rx)}
                        className="mt-4 rounded-sm bg-[#2a4540] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white"
                      >
                        Order Now
                      </button>
                    </article>
                  ))}
                </div>
              ))}

            {tab === "orders" &&
              (orders.length === 0 ? (
                <EmptyState text="No orders yet" />
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <article
                      key={order._id}
                      className="rounded-sm border border-[#2a4540]/10 bg-white p-5"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-[#2d423c]">
                            Order #{order._id.slice(0, 8)}
                          </h3>
                          <p className="text-sm text-[#6d5f55]">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-[#6d5f55]">
                            Delivery:{" "}
                            {order.delivery_method === "pickup"
                              ? "Pickup"
                              : "Home Delivery"}
                          </p>
                          <p className="text-sm text-[#6d5f55]">
                            Price: KES {order.total_price}
                          </p>
                        </div>
                        <div className="space-y-2 md:text-right">
                          <Pill>{order.order_status}</Pill>
                          {order.order_status === "received" && (
                            <button
                              onClick={() => handlePaymentOrder(order._id)}
                              className="block rounded-sm border border-[#2a4540]/25 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#2f4b45]"
                            >
                              Pay Now
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ))}
          </section>
        )}

        {selectedPrescription && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-7">
              <h2 className="font-display text-3xl font-semibold text-[#2d423c]">
                Create Order
              </h2>
              <p className="mt-2 text-sm text-[#665b53]">
                {selectedPrescription.medication_name}
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#8b776a]">
                    Delivery Method
                  </label>
                  <div className="space-y-2 text-sm text-[#665b53]">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="delivery"
                        value="pickup"
                        checked={deliveryMethod === "pickup"}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                      />
                      Pickup at Pharmacy
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="delivery"
                        value="delivery"
                        checked={deliveryMethod === "delivery"}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                      />
                      Home Delivery (+KES 500)
                    </label>
                  </div>
                </div>

                {deliveryMethod === "delivery" && (
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter full delivery address"
                    rows={3}
                    className="w-full rounded-xl border border-[#c8b6a6] px-3 py-2 text-sm outline-none focus:border-[#2f4b45]"
                  />
                )}

                <div className="rounded-xl bg-[#f0f7f5] p-3 text-sm text-[#665b53]">
                  Total: KES {deliveryMethod === "delivery" ? 2000 : 1500}
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => setSelectedPrescription(null)}
                  className="flex-1 rounded-sm border border-[#2a4540]/25 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#2f4b45]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateOrder}
                  disabled={isCreatingOrder}
                  className="flex-1 rounded-sm bg-[#2a4540] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-60"
                >
                  {isCreatingOrder ? "Creating..." : "Create Order"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-sm border border-dashed border-[#2a4540]/18 bg-[#f0f7f5] p-10 text-center text-sm text-[#6d5f55]">
      {text}
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-sm bg-[#eef6f3] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#2a4540]">
      {children}
    </span>
  );
}
