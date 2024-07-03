import db from "../models/index";



let CreateSale = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            // check username is exist??

            await db.Sales.create({
                sale_date: data.sale_date,
                quantity: data.quantity

            });
            resolve({
                errCode: 0,
                data: data
            })

            resolve({
                errCode: 0,
                message: 'OK'
            })
        } catch (e) {
            reject(e);

        }
    })
}
let deleteSale = (SaleId) => {
    return new Promise(async(resolve, reject) => {
        let sale = await db.Sales.findOne({
            where: { id: SaleId }
        })
        if (!sale) {
            resolve({
                errCode: 2,
                errMessage: "loại sản phẩm  không tồn tại"
            })
        }
        await db.Sales.destroy({
            where: { id: SaleId }
        });
        resolve({
            errCode: 0,
            errMessage: "sale sản phẩm đã bị xóa !"

        });
    })
}




let updateSaleData = (data) => {
    return new Promise(async(resolve, reject) => {
        try {

            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing required parameter"
                })
            }
            let Sale = await db.Sales.findOne({
                where: { id: data.id },
                raw: false
            })
            if (Sale) {


                Sale.sale_date = data.sale_date;
                Sale.quantity = data.quantity;



                await Sale.save();
                resolve({
                    errCode: 0,
                    errMessage: "update Sale succeeds !"
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "Sale not found !"
                });
            }
        } catch (e) {
            reject(e)

        }
    })
}


let getAllSale = (SaleId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let Sale = '';
            if (SaleId == 'ALL') {
                Sale = db.Sales.findAll({
                    order: [
                        ["createdAt", "DESC"]
                    ],
                })

            }
            if (SaleId && SaleId !== 'ALL') {
                Sale = await db.Sales.findOne({
                    where: { id: SaleId }, // 
                });

            }
            resolve(Sale)
        } catch (e) {
            reject(e);
        }
    })

}

module.exports = {
    getAllSale: getAllSale,
    CreateSale: CreateSale,
    deleteSale: deleteSale,
    updateSaleData: updateSaleData,

}