// For main Index  file

// mysqlConction.connect((err)=>{
//     if(err){
//         // throw err;
//         console.log(err)
//     }
//     console.log("mySQL Connect....")
// })

// app.get('/createDb', (req: Request, res: Response) => {
//     // console.log("I am Here")
//     // res.send('Express + TypeScript Server');
//     const sql:string = "CREATE DATABASE facerecognition"
//     mysqlConction.query(sql,(err,result)=> {
//         if (err)  console.log(err)
//         console.log(result)
//         res.send(`Database created`)
//     })
// });

// import mysql from 'mysql2';
// // mySQL Info
// export const mysqlConction  = mysql.createConnection({
//     host:"localhost",
//     user:"amaz11",
//     password:"123456",
//     database:"facerecognition"
// });