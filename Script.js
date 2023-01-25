const express = require("express")
const app = express()
const fs = require("fs")
const uuid = require("uuid")
const fileUpload = require("express-fileupload")
const cors = require("cors")

app.use(cors())
app.use(fileUpload())
app.use(express.static("images"))

app.get("/category", (req, res) => {
 let CategoryJson = JSON.parse(fs.readFileSync("./data/Category.json"))
 res.status(200).send(CategoryJson)
})

app.post("/category", (req, res) => {
 let CategoryJson = JSON.parse(fs.readFileSync("./data/Category.json"))

 if (req.body == undefined || req.files == null) {
  res.status(400).send("Req undefined")
 } else {

  var CategoryName = req.body.CategoryName
  var CategoryId = uuid.v4()
  var CategoryImg = Date.now() + req.files.CategoryImg.name

  var CategoryForm = {
   id: CategoryId,
   CategoryName: CategoryName,
   CategoryImg: CategoryImg
  }
  req.files.CategoryImg.mv(`${__dirname}/images/${CategoryImg}`)
  CategoryJson.push(CategoryForm)

  fs.writeFileSync("./data/Category.json", JSON.stringify(CategoryJson, null, 2))

  res.status(201).send("The Category Was Posted")

 }
})

app.delete("/category/:id", (req, res) => {
 let CategoryJson = JSON.parse(fs.readFileSync("./data/Category.json"))
 var CategoryId = req.params.id
 var FilterCategory = CategoryJson.filter(category => category.id !== CategoryId)
 var CategoryDel = false

 for (let i = 0; i < CategoryJson.length; i++) {
  if (CategoryJson[i].id === CategoryId) {
   CategoryDel = true
   fs.unlinkSync(`images/${CategoryJson[i].CategoryImg}`)
  }
 }
 if (CategoryDel) {
  fs.writeFileSync("./data/Category.json", JSON.stringify(FilterCategory, null, 2))
  res.status(200).send("Category Deleted")
 } else {
  res.status(400).send("This Category Id Was Not Defined")
 }
})

app.put("/category/:id", (req, res) => {
 var CategoryJson = JSON.parse(fs.readFileSync("./data/Category.json"))
 var CategoryId = req.params.id
 var CategoryReq = req.body
 var NewCategoryImg = req.files
 var CategoryPut = false

 if (CategoryReq == undefined || NewCategoryImg == null) {
  res.status(400).send("Body is empty")
  CategoryPut = false
 } else { 
  for (let i = 0; i < CategoryJson.length; i++) {
  if (CategoryJson[i].id === CategoryId) {
   CategoryPut = true
   var CategoryNewImg = Date.now() + req.files.CategoryImg.name

   fs.unlinkSync(`images/${CategoryJson[i].CategoryImg}`)
   NewCategoryImg.CategoryImg.mv(`${__dirname}/images/${CategoryNewImg}`)

   CategoryJson[i].CategoryName = CategoryReq.CategoryName
   CategoryJson[i].CategoryImg = CategoryNewImg
   fs.writeFileSync("./data/Category.json", JSON.stringify(CategoryJson, null, 2))
  }
 }

 if (CategoryPut === true) {
  res.status(200).send("Category Changed")
 } else {
  res.status(400).send("This Category Id Was Not Defined")
 }
 }
})

app.listen(5000, (err) => {
 if (!err) {
  console.log("Server run");
 } else {
  console.log(err);
 }
})
