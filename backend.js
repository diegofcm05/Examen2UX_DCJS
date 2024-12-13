const express= require('express');
const {initializeApp}= require('firebase/app');
const {getAuth, createUserWithEmailAndPassword}= require('firebase/auth');


const app=express();

const port=3000;



app.listen(port,()=>{
    console.log(`Servidor corriendose en https://localhost:${port}`);
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
app.post('/crearUsuarioFireBase',async(req,res)=>{

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
