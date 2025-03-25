import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '~/components/MainLayout/MainLayout';
import PageProductForm from '~/components/pages/PageProductForm/PageProductForm';
import PageCart from '~/components/pages/PageCart/PageCart';
import PageOrders from '~/components/pages/PageOrders/PageOrders';
import PageOrder from '~/components/pages/PageOrder/PageOrder';
import PageProducts from '~/components/pages/PageProducts/PageProducts';
import PageProductImport from '~/components/pages/admin/PageProductImport/PageProductImport';
import { initializeAuth } from '~/utils/auth';

export default function App() {
  // Initialize authentication when the app starts
  useEffect(() => {
    // Call the async function and handle any errors
    initializeAuth().catch(error => {
      console.error('Failed to initialize authentication:', error);
    });
  }, []);

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<PageProducts />} />
        <Route path="cart" element={<PageCart />} />
        <Route path="admin/products" element={<PageProducts />} />
        <Route path="admin/orders" element={<PageOrders />} />
        <Route path="admin/order/:id" element={<PageOrder />} />
        <Route path="admin/product-form/:id" element={<PageProductForm />} />
        <Route path="admin/product-form" element={<PageProductForm />} />
        <Route path="admin/product-import" element={<PageProductImport />} />
      </Route>
    </Routes>
  );
}