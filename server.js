const express = require('express');
const pg = require('pg');
const app = express();
const port = 3000;
const client = new pg.Client('postgres://localhost:5432/acme_ice_cream_db');
app.use(express.json());


app.get('/', (req , res) => {
res.send('Hello World Lets talk about Flavors');
});
//GET ALL FLAVORS
app.get('/api/flavors', async (req, res) => {
const response = await client.query("SELECT * FROM flavors");
console.log(response.rows);
res.json(response.rows);
});
// GET SPECIFIC FLAVOR
app.get('/api/flavors/:id', async (req, res) => {
const {id} = req.params;
const response = await client.query("Select * from flavors where id = $1", [id]);
res.json(response.rows);
});

//CREATE NEW FLAVOR
app.post ('/api/flavors', async (req, res) => {
const {name, price } = req.body;
console.log(req.body);
const response = await client.query("INSERT INTO flavors (name, price) VALUES ($1, $2) Returning *", [name, price]); 
res.json(response.rows);

});

//Put
app.put('/api/flavors/:id', async (req, res) =>{
const flavorId = parseInt(req.params.id);
const {name, price} = req.body;
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const date = today.getDate();
readableDate = year + '-'+ month + '-' +  date;


const response = await client.query(`UPDATE flavors set name = '${name}' , 
    price = ${price}, lastmodified = '${readableDate}'  WHERE id = ${flavorId} Returning *`);
res.json(response.rows);
});

//DELETE
app.delete('/api/flavors/:id', async ( req, res) => {
const {id} = req.params;
const response = await client.query("Delete from flavors where id = $1", [id]);
res.json(`Successfully Deleted student with ID of: ${id}`);
});




const init = async () => {
const SQL = `
DROP TABLE IF EXISTS flavors;
CREATE TABLE flavors(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    price INTEGER,
    createddate Date default now(),
    lastmodified Date default now()
);
INSERT INTO flavors(name, price) VALUES('Vanilla', 22);
INSERT INTO flavors(name, price) VALUES('Strawberry', 22);
INSERT INTO flavors(name, price) VALUES('Lemon', 22);
`;
await client.query(SQL);
}



app.listen(port, async () => {
await client.connect();
init();
console.log(`Example app listening on port ${port} `)
});