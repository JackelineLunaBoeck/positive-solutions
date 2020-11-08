import { db } from "@/components/firebase.js";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
class FuncionesDB {
    fill(coll, current=null, coll2=null, whereF=null, whereO=null, whereV=null){
        let data = [];
        if(whereF==null){    
            if(current==null){
                db.collection(coll).onSnapshot((snapshotChange) => {  
                    snapshotChange.forEach((doc) => {
                        data.push({
                            key: doc.id,
                            ...doc.data()
                        })
                    })
                })
            }
            else{
                db.collection(coll).doc(current).collection(coll2)
                .onSnapshot((snapshotChange) => {  
                    snapshotChange.forEach((doc) => {
                        data.push({
                            key: doc.id,
                            ...doc.data()
                        })
                    })
                })
            }
        }
        else{
            
            if(current==null){
                db.collection(coll).where(whereF, whereO, whereV).get()
                .then(snapshotChange => {  
                    snapshotChange.forEach((doc) => {
                        data.push({
                            key: doc.id,
                            ...doc.data()
                        })
                    })
                })
            }
            else{
                db.collection(coll).doc(current).collection(coll2).where(whereF, whereO, whereV)
                .onSnapshot((snapshotChange) => {  
                    snapshotChange.forEach((doc) => {
                        data.push({
                            key: doc.id,
                            ...doc.data()
                        })
                    })
                })
            }
        }
        return data;
    }
    createorupdate(coll, data, current, coll_det=null, current_det=null){
        delete data.key;
        let message = {status: 0, text:''}
        if(coll_det==null){   
            if(current==null){
                db.collection(coll).add(data).then(() => { 
                    message.status=0
                    message.text='Registro guardado con exito!';                   
                }).catch((error) => {
                    message.status=1
                    message.text=error;
                })
            }
            else{
                db.collection(coll).doc(current)
                .update(data).then(() => {
                    message.status=0
                    message.text='Registro guardado con exito!' 
                }).catch((error) => {
                    message.status=1
                    message.text=error
                });
            }
        }
        else{
            if(current_det==null){
                db.collection(coll).doc(current).collection(coll_det).add(data)
                .then(() => { 
                    message.status=0
                    message.text='Registro guardado con exito!';                   
                }).catch((error) => {
                    message.status=1
                    message.text=error;
                })
            }
            else{
                db.collection(coll).doc(current).collection(coll_det)
                .doc(current_det)
                .update(data).then(() => {
                    message.status=0
                    message.text='Registro guardado con exito!' 
                }).catch((error) => {
                    message.status=1
                    message.text=error
                });
            }
        }
        return message
    }
    editfield(coll, current, fieldName, newValue){
        db.collection(coll)
        .doc(current)
        .update({ fieldName: newValue })
        .then(() => {
        })
    }
    delete(coll, current){
        let message = {status: 0, text:''}
        db.collection(coll).doc(current).delete().then(() => {
            message.status=0
            message.text='Registro eliminado con exito!'
        })
        .catch((error) => {
            message.status=1
            message.text=error
        })
        return message
        
    }
    report(name, title, headers, data){
        let doc = new jsPDF('p', 'pt');
        doc.text(title, 40, 40);
        doc.autoTable(headers, data, {
          margin: {top: 60},
        });
        doc.save(name);
    }
    stock(sku, value, type){
        
        let productoActual = ""
        let stockActual = 0
        
        db.collection('productos')
        .where('sku', '==', sku)
        .get()
         .then(snapshotChange => {  
             snapshotChange.forEach((doc) => {
               this.productoActual = doc.id
               stockActual = doc.data().stock
             })
         })

        if(type=="up"){
            db.collection('productos')
            .doc(productoActual)
            .update({ 'stock': stockActual+value })
            .then(() => {
            })
        }
        else if(type=="down"){
            db.collection('productos')
            .doc(productoActual)
            .update({ 'stock': stockActual-value })
            .then(() => {
            })
        }
    }
}


export default new FuncionesDB();