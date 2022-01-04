const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3001;
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.DATABASE_URL,
    process.env.DATABASE_API_KEY
);

async function authenticateConnection() {
    let { data, error } = await supabase.from('Users').select('*');
    if (error || data.length === 0) {
        console.log('error authenticating', error);
        return
    }
    console.log('successfully connected to supabase database');
};

app.listen(port, () => {
    authenticateConnection();
    console.log(`app listening on port ${port}`)
});

app.get('/', (req, res) => {
    console.log('root request received')
});

app.post('/user', (req, res) => {
    console.log('post received')
    const { uid } = req.body;
    supabase.from('Users').select('*').match({uid: uid})
        .then((data) => {
            console.log('user', data)
            res.send({
                error: false,
                user: data.data[0]
            });
        })
        .catch(e => {
            console.log('error fetching user', e);
            res.send({
                error: true,
                user: null
            })
        })
        .finally(() => res.end())
})