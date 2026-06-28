// export async function getProviderBilling() {
//   try {
//     const token = localStorage.getItem('access_token');

//     const res = await fetch('/api/provider', {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     const result = await res.json();
//     console.log('Provider billing response888:', result);

//     if (res.ok) {
//       return {
//         success: true,
//         data: {
//           debt:              result.debt ?? 0,
//           totalEarnings:     result.totalEarnings ?? 0,
//           completedServices: result.completedServices ?? 0,
//           monthlyEarnings:   result.monthlyEarnings ?? [],
//           transactions:      result.transactions ?? [],
//         },
//       };
//     }

//     return { success: false, error: result.message || 'Failed to load billing data' };
//   } catch (error) {
//     return { success: false, error: error instanceof Error ? error.message : 'Network error' };
//   }
// }

// // export async function payProviderDebt() {
// //   try {
// //     const token = localStorage.getItem('access_token');

// //     const res = await fetch('/api/payments/provider-debt', {
// //   method: 'POST',
// //   headers: {
// //     Authorization: `Bearer ${token}`,
// //     'Content-Type': 'application/json',
// //   },
// //   body: JSON.stringify({}), 
// // });

// //     const result = await res.json();
// //     console.log('Pay debt response:', result);

// //     if (res.ok) {
// //       if (!result.paymentUrl) {
// //         return { success: false, error: 'Payment URL not found' };
// //       }
// //       return { success: true, paymentUrl: result.paymentUrl };
// //     }

// //     return { success: false, error: result.message || 'Failed to create payment' };
// //   } catch (error) {
// //     return { success: false, error: error instanceof Error ? error.message : 'Network error' };
// //   }
// // }

// export async function payProviderDebt() {
//   try {
//     const token = localStorage.getItem('access_token');

//     if (!token) {
//       return { success: false, error: 'You must be logged in.' };
//     }

//     const res = await fetch('/api/payments/provider-debt', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
//       body: JSON.stringify({}),
//     });

//     const result = await res.json();
//     console.log('Pay debt 9999response:', result);

//     if (res.ok) {
//       if (!result.paymentUrl) {
//         return { success: false, error: 'Payment URL not found' };
//       }
//       return { success: true, paymentUrl: result.paymentUrl };
//     }

//     return { success: false, error: result.message || 'Failed to create payment' };
//   } catch (error) {
//     return { success: false, error: error instanceof Error ? error.message : 'Network error' };
//   }
// }

export interface MonthlyEarning {
  month: string;
  amount: number;
}

export interface ProviderTransaction {
  serviceRequestId: string;
  title: string;
  amount: number;
  type: string; // e.g. "earning"
  date: string;
}

export interface ProviderBillingData {
  debt: number;
  totalEarnings: number;
  completedServices: number;
  monthlyEarnings: MonthlyEarning[];
  transactions: ProviderTransaction[];
  adminApproved: string; // e.g. "Active", "Banned", "Stopped"
}

export async function getProviderBilling() {
  try {
    const token = localStorage.getItem('access_token');

    const res = await fetch('/api/provider', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const text = await res.text();
    const result = text ? JSON.parse(text) : {};
    console.log('Provider billing response:', result);

    if (res.ok) {
      return {
        success: true,
        data: {
          debt: result.debt ?? 0,
          totalEarnings: result.totalEarnings ?? 0,
          completedServices: result.completedServices ?? 0,
          monthlyEarnings: result.monthlyEarnings ?? [],
          // API returns "recentTransactions", not "transactions"
          transactions: result.recentTransactions ?? [],
          adminApproved: result.adminApproved ?? 'Active',
        } as ProviderBillingData,
      };
    }

    return { success: false, error: result.message || 'Failed to load billing data' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

export async function payProviderDebt() {
  try {
    const token = localStorage.getItem('access_token');

    if (!token) {
      return { success: false, error: 'You must be logged in.' };
    }

    const res = await fetch('/api/payments/provider-debt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });

    const text = await res.text();
    const result = text ? JSON.parse(text) : {};
    console.log('Pay debt response:', result);

    if (res.ok) {
      if (!result.paymentUrl) {
        return { success: false, error: 'Payment URL not found' };
      }
      return { success: true, paymentUrl: result.paymentUrl };
    }

    return { success: false, error: result.message || 'Failed to create payment' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}