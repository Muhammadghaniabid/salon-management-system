// const express = require('express');
// const cors = require('cors');

// const app = express();
// app.use(express.json());
// app.use(cors());

// let users = [];
// let customers = [];

// // SIGNUP
// app.post('/signup', (req, res) => {
//   const { owner, shopName, phone, location, password } = req.body;

//     const exist = users.find(u => u.shopName === shopName);
//     if (exist) {
//         return res.json({ success: false, message: "Shop already exists" });
//     }

//     users.push({ owner, shopName, phone, location, password });
//     res.json({ success: true });
// });

// // LOGIN
// app.post('/login', (req, res) => {
//     const { shopName, password } = req.body;

//     const user = users.find(u => u.shopName === shopName && u.password === password);

//     if (user) {
//         res.json({ success: true });
//     } else {
//         res.json({ success: false });
//     }
// });

// // ADD CUSTOMER
// const SECRET_CODE = "786786"; // 👈 change this to your own code
// app.post('/add-customer', (req, res) => {
// const { owner, shopName, phone, location, password, code } = req.body;
//     customers.push({ name, employee, service, price, date, shopName });


//     res.json({ success: true });
// });
 
// // GET DATA
// app.get('/data/:shopName', (req, res) => {
//     const data = customers.filter(c => c.shopName === req.params.shopName);
//     res.json(data);
// });

// app.listen(3000, () => console.log("Server running on port 3000"));
// app.delete('/delete/:shopName/:index', (req, res) => {
//     const { shopName, index } = req.params;

//     const shopCustomers = customers.filter(c => c.shopName === shopName);

//     const globalIndex = customers.findIndex(c =>
//         c.shopName === shopName &&
//         JSON.stringify(c) === JSON.stringify(shopCustomers[index])
//     );

//     if (globalIndex !== -1) {
//         customers.splice(globalIndex, 1);
//     }

//     res.send("Deleted");
// });
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 🔐 SECRET CODE
const SECRET_CODE = "786786";

let users = [];
let customers = [];

// ================= SIGNUP =================
app.post('/signup', (req, res) => {
    const { owner, shopName, phone, location, password, code } = req.body;

    // 🔐 check secret code
    if (code !== SECRET_CODE) {
        return res.json({ success: false, message: "Invalid Secret Code" });
    }

    // ❌ prevent duplicate shop
    const exists = users.find(u => u.shopName === shopName);
    if (exists) {
        return res.json({ success: false, message: "Shop already exists" });
    }

    // ⏳ expiry 30 days
    const expiry = Date.now() + (30 * 24 * 60 * 60 * 1000);

    users.push({ owner, shopName, phone, location, password, expiry });

    res.json({ success: true });
});

// ================= LOGIN =================
app.post('/login', (req, res) => {
    const { shopName, password } = req.body;

    const user = users.find(u => u.shopName === shopName && u.password === password);

    if (!user) {
        return res.json({ success: false, message: "Wrong login" });
    }

    // ⏳ check expiry
    if (Date.now() > user.expiry) {
        return res.json({ success: false, message: "Subscription expired" });
    }

    res.json({ success: true, shopName: user.shopName });
});

// ================= ADD CUSTOMER =================
app.post('/add-customer', (req, res) => {
    const { name, employee, service, price, date, shopName } = req.body;

    customers.push({ name, employee, service, price, date, shopName });

    res.json({ success: true });
});

// ================= GET DATA =================
app.get('/data/:shopName', (req, res) => {
    const shopCustomers = customers.filter(c => c.shopName === req.params.shopName);
    res.json(shopCustomers);
});

// ================= DELETE =================
app.delete('/delete/:shopName/:index', (req, res) => {
    const { shopName, index } = req.params;

    const shopCustomers = customers.filter(c => c.shopName === shopName);

    const globalIndex = customers.findIndex(c =>
        c.shopName === shopName &&
        JSON.stringify(c) === JSON.stringify(shopCustomers[index])
    );

    if (globalIndex !== -1) {
        customers.splice(globalIndex, 1);
    }

    res.json({ success: true });
});

app.listen(3000, () => console.log("Server running on port 3000"));