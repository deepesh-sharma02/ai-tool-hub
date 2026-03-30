import { useState } from 'react';
import { ArrowLeft, Receipt, Plus, Trash2, Download, Send } from 'lucide-react';
import type { Language } from '../../App';

interface InvoiceToolProps {
  onBack: () => void;
  language: Language;
}

const translations = {
  en: {
    title: 'Create Bill / Invoice',
    businessName: 'Your Business Name',
    businessAddress: 'Business Address',
    businessPhone: 'Business Phone',
    businessGSTIN: 'GSTIN (Optional)',
    customerName: 'Customer Name',
    customerPhone: 'Customer Phone',
    customerAddress: 'Customer Address',
    items: 'Items',
    itemName: 'Item name',
    qty: 'Qty',
    price: 'Price (₹)',
    addItem: 'Add Item',
    gstRate: 'GST Rate (%)',
    subtotal: 'Subtotal',
    gst: 'GST',
    total: 'Total',
    generateBtn: 'Generate Invoice',
    generating: 'Generating...',
    download: 'Download PDF',
  },
  hi: {
    title: 'बिल / चालान बनाएं',
    businessName: 'व्यवसाय का नाम',
    businessAddress: 'व्यवसाय का पता',
    businessPhone: 'व्यवसाय का फोन',
    businessGSTIN: 'GSTIN (वैकल्पिक)',
    customerName: 'ग्राहक का नाम',
    customerPhone: 'ग्राहक का फोन',
    customerAddress: 'ग्राहक का पता',
    items: 'वस्तुएं',
    itemName: 'वस्तु का नाम',
    qty: 'मात्रा',
    price: 'कीमत (₹)',
    addItem: 'वस्तु जोड़ें',
    gstRate: 'GST दर (%)',
    subtotal: 'उप-योग',
    gst: 'GST',
    total: 'कुल',
    generateBtn: 'चालान बनाएं',
    generating: 'बन रहा है...',
    download: 'PDF डाउनलोड करें',
  },
  gu: {
    title: 'બિલ / ઇન્વૉઇસ બનાવો',
    businessName: 'બિઝનેસનું નામ',
    businessAddress: 'બિઝનેસનું સરનામું',
    businessPhone: 'બિઝનેસનો ફોન',
    businessGSTIN: 'GSTIN (વૈકલ્પિક)',
    customerName: 'ગ્રાહકનું નામ',
    customerPhone: 'ગ્રાહકનો ફોન',
    customerAddress: 'ગ્રાહકનું સરનામું',
    items: 'વસ્તુઓ',
    itemName: 'વસ્તુનું નામ',
    qty: 'જથ્થો',
    price: 'કિંમત (₹)',
    addItem: 'વસ્તુ ઉમેરો',
    gstRate: 'GST દર (%)',
    subtotal: 'પેટા-કુલ',
    gst: 'GST',
    total: 'કુલ',
    generateBtn: 'ઇન્વૉઇસ બનાવો',
    generating: 'બની રહી છે...',
    download: 'PDF ડાઉનલોડ કરો',
  },
};

interface Item {
  name: string;
  qty: number;
  price: number;
}

const API_BASE_URL = 'http://localhost:5000/api';

export function InvoiceTool({ onBack, language }: InvoiceToolProps) {
  const t = translations[language];
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessGSTIN, setBusinessGSTIN] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [items, setItems] = useState<Item[]>([{ name: '', qty: 1, price: 0 }]);
  const [gstRate, setGstRate] = useState(18);
  const [loading, setLoading] = useState(false);

  const addItem = () => {
    setItems([...items, { name: '', qty: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof Item, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: field === 'name' ? value : Number(value) };
    setItems(newItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.qty * item.price, 0);
  };

  const calculateGST = () => {
    return (calculateSubtotal() * gstRate) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateGST();
  };

  const handleGenerate = async () => {
    if (!businessName || !customerName || items.some(item => !item.name)) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/business/create-invoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          business_name: businessName,
          business_address: businessAddress,
          business_phone: businessPhone,
          business_gstin: businessGSTIN,
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_address: customerAddress,
          items: items,
          gst_rate: gstRate,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${Date.now()}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        alert('Invoice generated successfully!');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to generate invoice. Please login first.');
      }
    } catch (error) {
      console.error('Invoice error:', error);
      alert('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <Receipt className="w-6 h-6 text-purple-600" />
          <h1 className="text-xl">{t.title}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-lg mb-4">Business Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder={t.businessName}
              className="p-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
            />
            <input
              type="text"
              value={businessPhone}
              onChange={(e) => setBusinessPhone(e.target.value)}
              placeholder={t.businessPhone}
              className="p-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
            />
            <input
              type="text"
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
              placeholder={t.businessAddress}
              className="p-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none md:col-span-2"
            />
            <input
              type="text"
              value={businessGSTIN}
              onChange={(e) => setBusinessGSTIN(e.target.value)}
              placeholder={t.businessGSTIN}
              className="p-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none md:col-span-2"
            />
          </div>

          <h3 className="text-lg mb-4">Customer Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder={t.customerName}
              className="p-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
            />
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder={t.customerPhone}
              className="p-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
            />
            <input
              type="text"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder={t.customerAddress}
              className="p-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none md:col-span-2"
            />
          </div>

          <h3 className="text-lg mb-4">{t.items}</h3>
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-3 mb-3">
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateItem(index, 'name', e.target.value)}
                placeholder={t.itemName}
                className="col-span-6 p-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
              />
              <input
                type="number"
                value={item.qty}
                onChange={(e) => updateItem(index, 'qty', e.target.value)}
                placeholder={t.qty}
                className="col-span-2 p-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
              />
              <input
                type="number"
                value={item.price}
                onChange={(e) => updateItem(index, 'price', e.target.value)}
                placeholder={t.price}
                className="col-span-3 p-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
              />
              <button
                onClick={() => removeItem(index)}
                className="col-span-1 p-3 bg-red-50 hover:bg-red-100 rounded-xl border-2 border-red-200 transition"
              >
                <Trash2 className="w-5 h-5 text-red-600 mx-auto" />
              </button>
            </div>
          ))}

          <button
            onClick={addItem}
            className="w-full flex items-center justify-center gap-2 p-3 bg-purple-50 hover:bg-purple-100 rounded-xl border-2 border-purple-200 transition mb-6"
          >
            <Plus className="w-5 h-5" />
            {t.addItem}
          </button>

          <div className="mb-4">
            <label className="block mb-2">{t.gstRate}</label>
            <select
              value={gstRate}
              onChange={(e) => setGstRate(Number(e.target.value))}
              className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
            >
              <option value={0}>0% (No GST)</option>
              <option value={5}>5%</option>
              <option value={12}>12%</option>
              <option value={18}>18%</option>
              <option value={28}>28%</option>
            </select>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl mb-6">
            <div className="flex justify-between mb-2">
              <span>{t.subtotal}:</span>
              <span className="font-bold">₹{calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>{t.gst} ({gstRate}%):</span>
              <span className="font-bold">₹{calculateGST().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg border-t-2 pt-2">
              <span className="font-bold">{t.total}:</span>
              <span className="font-bold text-purple-600">₹{calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-purple-600 text-white py-4 rounded-xl hover:bg-purple-700 transition disabled:bg-gray-300 flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            {loading ? t.generating : t.generateBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
