const express= require('express');
const {initializeApp}= require('firebase/app');
const {getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut}= require('firebase/auth');
const bodyParser = require('body-parser');
const app=express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



let parser = bodyParser.urlencoded({extended: true});
app.use(parser);

//La password es Diego12345
// mongodb+srv://dfcm950:Diego12345@ux2024.ghudr.mongodb.net/?retryWrites=true&w=majority&appName=ux2024
const port=3000;
let uri = "mongodb+srv://dfcm950:Diego12345@ux2024.ghudr.mongodb.net/?retryWrites=true&w=majority&appName=ux2024"


//cliente establecido de MongoDB
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true
    }
})


//Funcion de conexion a la base de datos
async function connect  (){
    try{
        await client.connect();
        console.log("Conectado a la base de datos");
    }catch(error){
        console.error("Error al conectar con la base de datos", error);
    }
}


app.listen(port,()=>{
    console.log(`Servidor corriendose en https://localhost:${port}`);
    connect();
})


const firebaseConfig = {
    apiKey: "AIzaSyD2AoA3O1HBdSo6fVT0lk1iBiBBXRrhqso",
    authDomain: "examen2ux-dj.firebaseapp.com",
    projectId: "examen2ux-dj",
    storageBucket: "examen2ux-dj.firebasestorage.app",
    messagingSenderId: "669921057902",
    appId: "1:669921057902:web:cb28f9d24cff6357b21a7f",
    measurementId: "G-7Q68VMFKG3"
  };

  const server = initializeApp(firebaseConfig);



//FIREBASE

//Endpoint 1 de FIREBASE
app.post('/createUser',async(req,res)=>{

    const auth = getAuth();

    
        createUserWithEmailAndPassword(auth, req.body.email, req.body.password)
            .then((credencial) => {
                // Signed up 
               // const user = credencial.user;
                res.status(200).send({
                    mensaje: "Creacion de Usuario Exitosa!",
                    resultado:credencial,
                });
                // ...
            })
            .catch((error) => {
                //const errorCode = error.code;
                //const errorMessage = error.message;
                res.status(401).send({
                    error: error,
                });
                // ..
            });
    
            

});

//Endpoint 2 de FIREBASE
app.post('/logIn', async(req,res)=>{
    const auth= getAuth();
    signInWithEmailAndPassword(auth,req.body.email,req.body.password)
        .then((response)=>{
            res.status(200).send({
                ID: response.user.uid,
                Correo: response.user.email,
            });
        }).catch((error)=>{
            res.status(401).send({
                error: error,
            });
        });
});

//Endpoint 3 de FIREBASE
app.post('/logOut', async(req,res)=>{
    const auth= getAuth();
    signOut(auth)
        .then((response)=>{
            res.status(200).send({
                Confirmacion: "Se ha cerrado la sesion!",
                resultado: response,
            });
        }).catch((error)=>{
            res.status(401).send({
                error: error,
            });
        });
});




//MONGODB

//Examen#2, endpoint 1 de Mongo

app.post('/createPost', async (req, res)=>{

    try{
        const client = new MongoClient(uri);
        //conectarse a la base de datos
        const basedeDatos = client.db("claseux");
        //seleccionar la coleccion que queremos trabajar
        const coleccion = basedeDatos.collection("Post");
        //crear un nuevo registro
        const response = await coleccion.insertOne({ //hace un post a Atlas, en la collection Post
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            genero: req.body.genero,
            ...req.body
        });
        res.status(200).send({
            resultado: response,

        });
    }catch(error){
        res.status(401).send({
            error: error,

        });

    }

})

//Examen #2, endpoint 2 de Mongo 
app.get('/listPost', async (req, res)=>{
    try{
        const client = new MongoClient(uri);
        const baseDeDatos = client.db("claseux");
        const coleccion = baseDeDatos.collection("Post");
        const response = await coleccion.find({}).toArray();
        res.status(200).send({
            resultado: response,
            mensaje: "Documentos de Post."
        });
    }catch (error){
        res.status(401).send({
            error: error,

        });
    }


})


//Examen #2, endpoint 3
app.put('/editPost/:_id', async (req, res)=>{
    try{
        const client = new MongoClient(uri);
        const baseDeDatos = client.db("claseux");
        const coleccion = baseDeDatos.collection("Post");
        //update
        const response = await coleccion.updateOne(
            {
                //where nombre = req.body.nombre
                //filtros
                _id: new ObjectId(req.params._id),
            },
            {
                $set: {
                    //definir que campos queremos actualizar, en este caso, el nombre
                    nombre: req.body.nombre,
                }
            }
        );
        res.status(200).send({
            resultado: response,
            mensaje: "Se actualizo el documento"
        });

    }catch(error){
        res.status(401).send({
            error: error,

        });
    }

})


//Examen#2, endpoint 4
//delete
app.delete('/deletePost/:_id', async (req, res)=>{
    try{
        const client = new MongoClient(uri);
        const baseDeDatos = client.db("claseux");
        const coleccion = baseDeDatos.collection("Post");

        //query
        const response = await coleccion.deleteOne({
            _id: new ObjectId(req.params._id),

        });
        if (response.deletedCount === 0){
            res.status(200).send({
                resultado: response,
                mensaje: "No se encontro un documento para borrar."
            });
        }else{
            res.status(200).send({
                resultado: response,
                mensaje: "Se actualizo el documento"
            });
        }
    }catch(error){
        
        res.status(401).send({
            error: error,

        });
    }

})