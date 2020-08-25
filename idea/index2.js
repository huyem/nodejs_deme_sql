const express= require("express"); // tao module
const app = express();
const  PORT = process.env.PORT||5000; // tao cong port
//tao server
app.listen(PORT,function () {
    console.log("Server is running...");
})
app.set("view engine","ejs"); //báo hiệu view engine là file ejs
app.use(express.static("public")); // cho quyền sử dụng các file tĩnh bởi máy chủ(VD như file css)
//config connect MSSQL
const mssql=require("mssql");
const config={
    server:'cloud-apt.database.windows.net',//ip may chu
    database: 'Development',// ten co so du lieu can lay
    user:'quanghoa',//ten ng dung
    password: 'Studentaptech123' //mat khau
}
mssql.connect(config,function (err) {
    if(err) console.log(err);
    else console.log("connect DB thanh cong");
})
//tao doi tuong truy van du lieu
var db = new mssql.Request();
//tạo trang chủ cai nay routing chi trong 1 lan
app.get("/",function (req,res) {
    //lay du lieu
    db.query("Select * From Lab4_KhachHang", function(err,rows){
        if(err) res.send("Khong co ket qua");
        else
            res.send(rows.recordset);// tra ve du lieu tu database
    })
    // res.render("home");
});
cloud-apt.database.windows.net
cloud-apt.database.windows.net

Hải Nam
<ul>
<% khs.map(function (v) { %>
<li><%= v.TenKH %></li>
        <% }) %>
</ul>
db.query("Select * From Lab4_KhachHang", function(err,rows){
    if(err) res.send("Khong co ket qua");
    else
        // res.send(rows.recordset);// tra ve du lieu tu database
        res.render("home",{
            khs: rows.recordset
        })
})

Hải Nam
<!doctype html>
<html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport"
content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" href="/css/app.css">
    </head>
    <body>
    <form action="/search" method="GET">
    <input type="text" name="keyword"/>
    <button type="submit">Search</button>
    </form>
    <h1>Day la trang chu</h1>
<ul>
<% khs.map(function (v) { %>
<li><%= v.TenKH %></li>
        <% }) %>
</ul>
<!--    <ul>-->
<!--        <% khs.map(function (v) { %>-->
<!--            <li><%= v.TenSP %></li>-->
    <!--        <% }) %>-->
    <!--    </ul>-->
    </body>
    </html>
!

    Hải Nam
app.get("/search",function (req,res) {
    let key_search = "'%"+req.query.keyword+"%'";
    //lay du lieu
    db.query("Select * From Lab4_KhachHang WHERE TenKH LIKE "+key_search, function(err,rows){
        if(err) res.send("Khong co ket qua");
        else
            // res.send(rows.recordset);// tra ve du lieu tu database
            res.render("home",{
                khs: rows.recordset
            })
    })
    // res.render("home");
});