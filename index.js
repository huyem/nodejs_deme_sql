const express = require("express");// tạo module
const app = express();
const PORT = process.env.port || 5000; // tạo cổng local host để truy cập

app.listen(PORT,function () {
 console.log("server is running...");
});
// tao sever
// su dung ejs
// app.get("/",function (req,res) {
//     res.send("day la trang chu")});
//
// });
app.use (express.static("public")); //cho quyền sủ dụng các file  tĩnh bởi máy chủ(vi du như fl=ile css)
app.set("view engine","ejs"); // báo là view engine là file ejs

///config connect mssql

const mssql = require("mssql");

const config = {
    server:"DESKTOP-0Q6N0DH\\SQLEXPRESS", // ip cua máy chủ
    database:"assignment5",  // tên cơ sở dữ liệu cần truy câp lấy dữ liệu
    user: "sa", // tên người dùng
    password :"thuhang1004", // mật khẩu
    options: {
        encrypt: false
    }
}
mssql.connect(config,function (err) {
    if(err) console.log(err);
    else console.log("connect db thanh cong");


});
// tạo đối tượng truy vấn vào dữ liệu
var db = new mssql.Request();
// tạo trang chủ cái này routing chỉ trong một lần

app.get("/",function (req,res) {
  //lay du lieu
    db.query("SELECT * FROM Lab4_KhachHang ",
        function(err,rows){
        if(err)
            res.send("kog co ket qua");
        else
            // res.send(rows.recordset);  //trả về dữ liệu của database mk tryu vấn

            res.render("home",{
            khs: rows.recordset
            })
    })
});

app.get("/search",function (req,res) {
    let key_search = "'%"+ req.query.keyword+"%'";  // tim kiếm khách hang bằng keyword
    //lay du lieu
    db.query("SELECT * FROM Lab4_KhachHang where TenKH like"+key_search, function(err,rows){
        if(err)
            res.send("kog co ket qua");
        else
            //res.send(rows.recordset);
            res.render("home",{
                khs: rows.recordset
            })
    })
});
app.get("/sanpham",function (req,res) {
    db.query("SELECT * FROM Lab4_SanPham ",
        function(err,rows){
            if(err)
                res.send("kog co ket qua");
            else
                // res.send(rows.recordset);  //trả về dữ liệu của database mk tryu vấn

                res.render("sanpham",{
                    sanpham: rows.recordset
                })
        })

})

app.get("/them-khach-hang",function (req,res) {
    res.render("demo");

})
//link nhap du lieu vao db
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended:true})); // neu de la fail thif chir = nhan so va chuoi

app.post ("/luu-khach-hang",function (req,res) {
    let ten = req.body.TenKH;
    // res.send(ten);
    let diaChi = req.body.Diachi;
    let dt = req.body.DienThoai;

    let sql_text = "INSERT INTO Lab4_KhachHang(TenKH,DiaChi,DienThoai) values ('"+ten+"','"+diaChi+"','"+dt+"')"
    db.query(sql_text,function(err,rows){
        if(err) res.send(err);
        else res.redirect("/");
    })
})


app.get("/them-san-pham",function (req,res) {
    res.render("formthemsp");
})
app.post("/luu-san-pham",function (req,res) {
    let tensp = req.body.TenSP;
    let donvi = req.body.DonVi;
    let mota = req.body.MoTa;
    let gia = req.body.Gia;
    let sql_text2 = "insert into Lab4_SanPham(TenSP,DonVi,Gia,MoTa) values ('"+tensp+"','"+donvi+"','"+mota+"','"+gia+"')"

    db.query(sql_text2,function (err,rows) {
        if(err) res.send(err);
        else res.redirect("/sanpham")

    })

})


// tao don hang
app.get("/tao-don-hang",function (req,res) {
// res.render("donhang")
    let sql_text = "SELECT * FROM Lab4_KhachHang;SELECT * FROM Lab4_SanPham";
    db.query(sql_text,function (err,rows) {
        if(err) res.send(err);
        else {
            res.render("donhang",{
                khs:rows.recordsets[0],
                sps:rows.recordsets[1]
// NEU LA MOT cau sql thi dung recordset
            })
        }
    })

})

// nhs=an gu=iu lieu tao don
app.post("/luu-don-hang",function (req,res) {
    let idKH = req.body.KHID;
    let idSP = req.body.IDSP;
    let sql_text = "select * from Lab4_SanPham where IDSanPham in ("+idSP+");";
// res.send(idKH)});
    db.query(sql_text,function (err,rows) {
        if(err) res.send(err)
        else {
            let sps = rows.recordset;
            let tongtien =0 ;
            sps.map(function (e) {
                tongtien += e.Gia;
            });
            let sql_text2 = "INSERT INTO Lab_4DonHang(MaKH,TongTien,ThoiGian)" + "values(" +idKH+","+tongtien+",getdate());select scope_identity() as IDDH;";
            db.query(sql_text2,function (err,rows) {
                let donhang = rows.recordset[0]
                let MaSo = donhang.IDDH;
                let sql_text3 = "";
                sps.map(function (e) {
                    sql_text3 += "insert into Lab_4SanPhamDonHang(IDDH,IDSP,SoLuong,ThanhTien)"+
                    "values("+MaSo+","+e.IDSanPham+","+(e.Gia*1)+");";

                })
                db.query(sql_text3,function (err,rows) {
                    if(err) res.send(err);
                    else res.send("toa don hang thanh cong");


                })
            })
        }
    })
})


    // list xem tat
    //find tim kiem ]
    // fine one tim den 1 nguoi
    app.get("/chi-tiet-khach-hang/:id",async function (req,res) {
        let khid = req.params.id;
        //res.send(khid);
        let sql_text = "select * from Lab4_KhachHang where IDKH = " + khid;
        let kh = "khong co";
        // db.query(sql_text,function (err,rows) {
        //     if(err) res.send(err);
        //     else
        //         res.send(rows.recordset);
        //
        // })
        await db.query(sql_text).then(result=>{
            kh = result;
        }).catch(function (err) {
            console.log(err);
        });
        let sql_text2 = "select * from Lab_4DonHang where MaKH = " + khid;
        let donhang = [];
        await db.query(sql_text2).then(result=>{
            donhang = result;
        }).catch(function (err) {
            console.log(err);
        });
        await res.render("khachhang",{
            khachhang:kh.recordset[0],
            donhang:donhang.recordset
        });

    })

    // :/id la tham so can truyen vao




