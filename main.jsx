// Sample branches across Uzbekistan with approximate coordinates
export const branches = [
  { id: 'b1', companyId: 'c1', name: 'Tashkent Central', city: 'Tashkent', address: 'Amir Temur Ave 15', phone: '+998 71 200 1010', lat: 41.3111, lng: 69.2797, hours: '08:00 — 22:00', cars: 24, capacity: 30 },
  { id: 'b2', companyId: 'c1', name: 'Tashkent Airport', city: 'Tashkent', address: 'Islam Karimov Intl. Airport', phone: '+998 71 200 1011', lat: 41.2579, lng: 69.2811, hours: '24/7', cars: 18, capacity: 25 },
  { id: 'b3', companyId: 'c1', name: 'Samarkand Hub', city: 'Samarkand', address: 'Registon St 8', phone: '+998 66 233 0202', lat: 39.6542, lng: 66.9597, hours: '08:00 — 21:00', cars: 14, capacity: 20 },
  { id: 'b4', companyId: 'c1', name: 'Bukhara Old Town', city: 'Bukhara', address: 'Lyabi Hauz Square', phone: '+998 65 224 4040', lat: 39.7747, lng: 64.4286, hours: '09:00 — 20:00', cars: 10, capacity: 14 },
  { id: 'b5', companyId: 'c1', name: 'Andijan City', city: 'Andijan', address: 'Babur St 22', phone: '+998 74 223 1212', lat: 40.7821, lng: 72.3442, hours: '08:00 — 20:00', cars: 8, capacity: 12 },
  { id: 'b6', companyId: 'c1', name: 'Namangan Center', city: 'Namangan', address: 'Navoi Ave 9', phone: '+998 69 225 5050', lat: 40.9983, lng: 71.6726, hours: '08:00 — 20:00', cars: 12, capacity: 15 },

  { id: 'b7', companyId: 'c2', name: 'Tashkent Yunusabad', city: 'Tashkent', address: 'Yunusabad 12', phone: '+998 71 230 5050', lat: 41.3650, lng: 69.2900, hours: '08:00 — 22:00', cars: 16, capacity: 22 },
  { id: 'b8', companyId: 'c2', name: 'Tashkent Chilanzar', city: 'Tashkent', address: 'Chilanzar 7', phone: '+998 71 230 6060', lat: 41.2820, lng: 69.2050, hours: '08:00 — 22:00', cars: 14, capacity: 20 },
  { id: 'b9', companyId: 'c2', name: 'Samarkand Airport', city: 'Samarkand', address: 'SKD Airport', phone: '+998 66 233 7070', lat: 39.7005, lng: 66.9839, hours: '24/7', cars: 12, capacity: 18 },
  { id: 'b10', companyId: 'c2', name: 'Fergana Branch', city: 'Fergana', address: 'Mustaqillik 5', phone: '+998 73 244 8080', lat: 40.3894, lng: 71.7833, hours: '08:00 — 20:00', cars: 10, capacity: 14 },

  { id: 'b11', companyId: 'c3', name: 'Samarkand Registan', city: 'Samarkand', address: 'Registan Square', phone: '+998 66 235 1010', lat: 39.6547, lng: 66.9758, hours: '08:00 — 21:00', cars: 14, capacity: 18 },
  { id: 'b12', companyId: 'c3', name: 'Samarkand Bibi Khanum', city: 'Samarkand', address: 'Bibi-Khanum Mosque area', phone: '+998 66 235 2020', lat: 39.6633, lng: 66.9783, hours: '09:00 — 20:00', cars: 12, capacity: 16 },
  { id: 'b13', companyId: 'c3', name: 'Bukhara Connect', city: 'Bukhara', address: 'Mehtar Anbar 3', phone: '+998 65 235 3030', lat: 39.7689, lng: 64.4231, hours: '09:00 — 20:00', cars: 12, capacity: 14 },

  { id: 'b14', companyId: 'c4', name: 'Bukhara Heritage', city: 'Bukhara', address: 'Ark Fortress St', phone: '+998 65 245 4040', lat: 39.7758, lng: 64.4147, hours: '08:00 — 21:00', cars: 12, capacity: 14 },
  { id: 'b15', companyId: 'c4', name: 'Bukhara Airport', city: 'Bukhara', address: 'Bukhara Intl. Airport', phone: '+998 65 245 4141', lat: 39.7750, lng: 64.4833, hours: '24/7', cars: 10, capacity: 12 },

  { id: 'b16', companyId: 'c5', name: 'Fergana Central', city: 'Fergana', address: 'Al-Fergani St 10', phone: '+998 73 256 5050', lat: 40.3839, lng: 71.7833, hours: '08:00 — 20:00', cars: 9, capacity: 12 },
  { id: 'b17', companyId: 'c5', name: 'Andijan Valley', city: 'Andijan', address: 'Navoi Ave 21', phone: '+998 74 256 6060', lat: 40.7833, lng: 72.3500, hours: '08:00 — 20:00', cars: 10, capacity: 12 },
  { id: 'b18', companyId: 'c5', name: 'Namangan Hub', city: 'Namangan', address: 'Uychi St 14', phone: '+998 69 256 7070', lat: 40.9991, lng: 71.6700, hours: '08:00 — 20:00', cars: 9, capacity: 12 },

  { id: 'b19', companyId: 'c6', name: 'Tashkent Premium Lounge', city: 'Tashkent', address: 'Mustaqillik Sq 1', phone: '+998 71 267 8080', lat: 41.3115, lng: 69.2823, hours: '09:00 — 23:00', cars: 18, capacity: 20 },
  { id: 'b20', companyId: 'c6', name: 'Tashkent Airport VIP', city: 'Tashkent', address: 'TAS Airport VIP Terminal', phone: '+998 71 267 9090', lat: 41.2580, lng: 69.2820, hours: '24/7', cars: 13, capacity: 16 }
]
