import React from 'react';

export default function DemoExplanationPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Trivexa Demo Ortamı
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Trivexa ajans yönetim sisteminin demo ortamına hoş geldiniz. Bu sürüm, projenin tüm yeteneklerini güvenli bir şekilde denemeniz için sahte verilerle donatılmıştır ve düzenli olarak sıfırlanmaktadır.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
            <a
              href="http://localhost:3000/demo-login"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Yönetim Paneline Git (Demo Login)
            </a>
            <a
              href="http://localhost:3001/customer-login"
              className="rounded-md bg-emerald-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              Müşteri Paneline Git (Demo)
            </a>
            <a href="/kurumsal" className="text-sm font-semibold leading-6 text-gray-900 mt-4 sm:mt-0">
              Landing (Kurumsal) Sayfayı Gör <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
