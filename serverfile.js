let express=require("express")
let app=express()

app.use(express.json())
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*")
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"

    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With ,Content-Type, Accept"

    );
    next();

   
});
//const port=2410
var port = process.env.PORT || 2410;
app.listen(port,()=>console.log(`Node app is listinng${port}`))
let {studentData}=require('./students.js')
let fs=require('fs');
let filename='studnet.json';
app.get('/svr/resetData',function(req,res){
    let data=JSON.stringify(studentData)
    fs.writeFile(filename,data,function(err){
        if(err){
            console.log(res.status(404).send(err))
        }
        else{
            res.send('data in file is reset')
        }
    })
   

})
app.get("/svr/students",function(req,res){
    fs.readFile(filename,"utf8",function(err,data){
        if(err){
            res.status(404).send(err)
        }
        else{
          let newdata=JSON.parse(data)
          res.send(newdata)
        }

    })
})
app.get("/svr/students/:id",function(req,res){
    let {id}=req.params
    id=+id
    fs.readFile(filename,"utf8",function(err,data){
        if(err){
            res.status(404).send(err)
        }
        else{
          let newdata=JSON.parse(data)
          let student=newdata.find(elem=>elem.id==id)
          if(student){
            console.log('kadir')
            res.send(student)
           
          }
          else{
            console.log('arman')
            res.status(404).send('student is not found')
          
          }
        }

    })
})
app.get("/svr/students/course/:name",function(req,res){
    let {name}=req.params
    fs.readFile(filename,"utf8",function(err,data){
        if(err){
            res.status(404).send(err)
        }
        else{
          let newdata=JSON.parse(data)
          let courses=newdata.filter(elem=>elem.course==name)
          res.send(courses)
        }

    })
})
app.post("/svr/students",function(req,res){
    let {body}=req
    fs.readFile(filename,'utf-8',function(err,data){
        if(err){
            res.status(404).send('error in file reading')
        }
        else{
            let arr=JSON.parse(data)
            console.log(arr)
            

            let maxid=arr.reduce((acc,curr)=>curr.id>acc?curr.id:acc,0)
            let newid=maxid+1
            console.log(newid)
            let newstudent={...body,id:newid}
            arr.push(newstudent)
            let newarr=JSON.stringify(arr)
            fs.writeFile(filename,newarr,function(err){
                if(err){
                    res.status(404).send(err)
                }
                else{
                   res.send(newstudent) 
                }
            })
            
        }
    })
})
app.put("/svr/students/:id",function(req,res){
    let {body}=req
    let {id}=req.params
    id=+id
   
    fs.readFile(filename,'utf-8',function(err,data){
        if(err){
            res.status(404).send('error in file reading')
        }
        else{
            let arr=JSON.parse(data)
            let index=arr.findIndex(elem=>elem.id==id)
            console.log('index is',index)
            console.log('body  is',body)
            if(index>=0)
            {
                let newstudent={...body,id:id}
                arr[index]=newstudent
                let data2=JSON.stringify(arr)
                fs.writeFile(filename,data2,function(err){
                if(err){
                    res.status(404).send(err)
                }
                else{
                   res.send(newstudent) 
                }
            })
            }
            else{
                res.status(404).send('student is not found for edit detail')
            }
           
            
            
        }
    })
})
app.delete("/svr/students/:id",function(req,res){
   
    let {id}=req.params
    id=+id
   
    fs.readFile(filename,'utf-8',function(err,data){
        if(err){
            res.status(404).send('error in file reading')
        }
        else{
            let arr=JSON.parse(data)
            let index=arr.findIndex(elem=>elem.id==id)
            console.log('index is',index)
           
            if(index>=0)
            {
              
                let deletedstudent= arr.splice(index,1)
                let data2=JSON.stringify(arr)
                fs.writeFile(filename,data2,function(err){
                if(err){
                    res.status(404).send(err)
                }
                else{
                   res.send(deletedstudent) 
                }
            })
            }
            else{
                res.status(404).send('student is not found for deletinng')
            }
           
            
            
        }
    })
})