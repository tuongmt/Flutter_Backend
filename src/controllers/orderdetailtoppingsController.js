import OrderDetailToppingsServices from "../services/OrderDetailToppingsServices";

let handlegetAllOrderdetailtoppings = async (req, res) => {
  let id = req.query.id; //all, id
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing require parameters",
      products: [],
    });
  }
  let Oderdetail = await OrderDetailToppingsServices.getAllOrderDetailsToppings(id);
  console.log(Oderdetail);
  return res.status(200).json({
    errCode: 0,
    errMessage: "OK",
    Oderdetail,
  });
};

let handleCreateOrderdetailtoppings = async (req, res) => {
  let message = await OrderDetailToppingsServices.createOrderDetailToppings(req.body);
  return res.status(200).json(message);
};

let handleDeleteOrderdetailtoppings = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters !",
    });
  }
  let message = await OrderDetailToppingsServices.deleteOrderDetailsToppings(req.body.id);
  console.log(message);
  return res.status(200).json(message);
};

let handleEditOrderdetailtoppings = async (req, res) => {
  let data = req.body;
  let message = await OrderDetailToppingsServices.updateOrderDetailsToppingsData(data);
  return res.status(200).json(message);
};

// let handleLayhoadon = async (req, res) => {
//   let id = req.query.id; //all, id
//   if (!id) {
//     return res.status(200).json({
//       errCode: 1,
//       errMessage: "Missing require parameters",
//     });
//   }
//   let orders1 = await OrderDetailToppingsServices.layhoadon(id);

//   return res.status(200).json({
//     errCode: 0,
//     errMessage: "OK",
//     orders1,
//   });
// };

module.exports = {
  handlegetAllOrderdetailtoppings: handlegetAllOrderdetailtoppings,
  handleCreateOrderdetailtoppings: handleCreateOrderdetailtoppings,
  handleDeleteOrderdetailtoppings: handleDeleteOrderdetailtoppings,
  handleEditOrderdetailtoppings: handleEditOrderdetailtoppings,
};
