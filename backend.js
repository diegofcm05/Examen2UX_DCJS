const express= require('express');
const {initializeApp}= require('firebase/app');
const {getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut}= require('firebase/auth');
const bodyParser = require('body-parser');
const app=express();

const port=3000;

let parser = bodyParser.urlencoded({extended: true});

app.use(parser);

app.listen(port,()=>{
    console.log(`Servidor corriendose en https://localhost:${port}`);
})
//perdone ing. tuve que robarle su API por que no encontre manera de que la nuestra diera :"D 
// ATTE:Junnior (perdone mi severo caso de skill issue)
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
app.post('/crearUsuario',async(req,res)=>{

    const auth = getAuth();

    
        createUserWithEmailAndPassword(auth, req.body.email, req.body.password)
            .then((credencial) => {
                // Signed up 
               // const user = credencial.user;
                res.status(200).send({
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

app.post('/login', async(req,res)=>{
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


app.post('/logout', async(req,res)=>{
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

