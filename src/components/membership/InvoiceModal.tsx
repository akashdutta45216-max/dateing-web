import React from 'react';
import { Invoice } from '../../types';
import { X, Download, Printer, CheckCircle2, Heart, ShieldCheck } from 'lucide-react';

interface InvoiceModalProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ invoice, onClose }) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md text-slate-900">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden print:p-0 print:border-none print:shadow-none">
        
        {/* Modal Controls (Hidden in print) */}
        <div className="px-6 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Official Tax Invoice & Receipt</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
              Payment Confirmed
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors flex items-center gap-1.5 text-xs font-semibold px-2.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Body */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-800" id="invoice-printable">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-purple-600 flex items-center justify-center text-white">
                  <Heart className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight text-slate-900">PremKotha</h2>
                  <p className="text-[10px] text-slate-500 font-medium">প্রেমকথা · West Bengal Dating Platform</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {invoice.companyName}<br />
                {invoice.companyAddress}<br />
                GSTIN: <span className="font-mono font-semibold">{invoice.gstin}</span>
              </p>
            </div>

            <div className="text-right">
              <h3 className="text-lg font-bold text-rose-600 uppercase tracking-wider">TAX INVOICE</h3>
              <p className="text-xs text-slate-700 font-mono font-semibold mt-1">{invoice.invoiceNumber}</p>
              <p className="text-xs text-slate-500 mt-0.5">Date: {invoice.date}</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
                ✓ {invoice.status}
              </span>
            </div>
          </div>

          {/* Customer & Transaction Info */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Billed To (Customer)</p>
              <p className="text-sm font-bold text-slate-900 mt-1">{invoice.customerName}</p>
              <p className="text-slate-600">{invoice.customerEmail}</p>
              <p className="text-slate-600">{invoice.customerMobile}</p>
              <p className="text-slate-500 text-[11px] mt-1">West Bengal, India</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Payment Metadata</p>
              <p className="text-slate-700 mt-1">Order ID: <span className="font-mono font-medium">{invoice.orderId}</span></p>
              <p className="text-slate-700">Transaction ID: <span className="font-mono font-medium">{invoice.transactionId}</span></p>
              <p className="text-slate-700">Mode: <span className="font-medium">Online Payment Gateway</span></p>
              <p className="text-slate-500 text-[11px]">Settled directly to merchant bank account</p>
            </div>
          </div>

          {/* Line items table */}
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-y border-slate-300 bg-slate-100 text-slate-600 uppercase text-[10px] tracking-wider">
                <th className="py-2 px-3">Item & Description</th>
                <th className="py-2 px-3 text-center">Duration</th>
                <th className="py-2 px-3 text-right">Taxable Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="py-3 px-3">
                  <p className="font-bold text-slate-900">{invoice.planName}</p>
                  <p className="text-[11px] text-slate-500">
                    Premium matchmaking access, extended swipes & in-app calling allowance
                  </p>
                </td>
                <td className="py-3 px-3 text-center font-medium text-slate-700">{invoice.durationLabel}</td>
                <td className="py-3 px-3 text-right font-semibold text-slate-900">₹{invoice.baseAmount}</td>
              </tr>
            </tbody>
          </table>

          {/* Totals Calculation */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal (Base):</span>
                <span>₹{invoice.baseAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>CGST (9%):</span>
                <span>₹{(invoice.gstAmount / 2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>SGST (9%):</span>
                <span>₹{(invoice.gstAmount / 2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-300 pt-2 text-sm font-bold text-slate-900">
                <span>Total Paid (INR):</span>
                <span>₹{invoice.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-500 space-y-1">
            <p>This is a computer-generated tax invoice and requires no physical signature under Indian Information Technology Act, 2000.</p>
            <p>Customer Support: support@premkotha.in | Bidhannagar, Kolkata 700091</p>
          </div>

        </div>

      </div>
    </div>
  );
};
