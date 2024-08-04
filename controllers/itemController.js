const admin = require("firebase-admin");
const db = admin.firestore();
const jwt = require("jsonwebtoken");

async function validateToken(token) {
  const secret = "secret"; // Debe ser la misma clave utilizada al firmar el token

  try {
    const decoded = jwt.verify(token, secret);
    console.log("Token válido:", decoded);
    // Aquí puedes proceder con la lógica de negocio si el token es válido
    return true;
  } catch (err) {
    console.error("Token no válido:", err.message);
    // Aquí manejas el caso de un token inválido, por ejemplo, rechazando la solicitud
    return false;
  }
}

exports.createItem = async (req, res) => {
  /* 
     #swagger.tags = ['Items']
     #swagger.description = 'Create an item'
     #swagger.summary = 'Create an item'
     #swagger.parameters['data'] = {
         in: 'body',
         description: 'Data to create an item',
         required: true,
     }
     #swagger.responses[201] = {
         description: 'Item successfully created',
     }
     #swagger.responses[400] = {
         description: 'Bad request',
     }
   */

  try {
    const data = req.body;
    const itemRef = await db.collection("items").add(data);
    res.status(201).send(`Created a new item: ${itemRef.id}`);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.getAllItems = async (req, res) => {
  /* 
     #swagger.tags = ['Items']
     #swagger.description = 'Get all items entries'
     #swagger.summary = 'Get all items entries'
     #swagger.parameters['token'] = {
         description: 'JWT Token',
         required: true,
     }
     #swagger.responses[200] = {
         description: 'Items entries successfully obtained',
     }
     #swagger.responses[400] = {
         description: 'Bad request',
     }
   */

  const token = req.params.token;

  try {
    const decoded = jwt.verify(token, secret);
    const itemsSnapshot = await db.collection("items").get();
    const items = [];
    itemsSnapshot.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));
    res.status(200).json(items);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.getItem = async (req, res) => {
  /* 
     #swagger.tags = ['Items']
     #swagger.description = 'Get an item entry'
     #swagger.summary = 'Get an item entry'
     #swagger.parameters['id'] = {
         description: 'Item id',
         required: true,
     }
     #swagger.responses[404] = {
         description: 'Item not found',
     }
     #swagger.responses[400] = {
         description: 'Bad request',
     }
     #swagger.responses[200] = {
         description: 'Get an item by id',
     }
   */

  try {
    const itemId = req.params.id;
    const itemDoc = await db.collection("items").doc(itemId).get();
    if (!itemDoc.exists) {
      res.status(404).send("Item not found");
    } else {
      res.status(200).json({ id: itemDoc.id, ...itemDoc.data() });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.updateItem = async (req, res) => {
  /* 
    #swagger.tags = ['Items']
    #swagger.description = ''
    #swagger.summary = ''
    #swagger.parameters['id'] = {
      description: '',
      required: true,
    }
    #swagger.parameters['data'] = {
      in: 'body',
      description: '',
      required: true,
    }
    #swagger.responses[200] = {
      description: '',
    }
    #swagger.responses[400] = {
      description: '',
    }
  */

  try {
    const itemId = req.params.id;
    const data = req.body;
    const itemRef = db.collection("items").doc(itemId);
    await itemRef.update(data);
    res.status(200).send("item updated");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.deleteItem = async (req, res) => {
  /* 
    #swagger.tags = ['Items']
    #swagger.description = ''
    #swagger.summary = ''
    #swagger.parameters['id'] = {
      description: '',
      required: true,
    }

    #swagger.responses[200] = {
      description: '',
    }
    #swagger.responses[400] = {
      description: '',
    }
  */

  try {
    const itemId = req.params.id;
    await db.collection("items").doc(itemId).delete();
    res.status(200).send("Item Detected");
  } catch (error) {
    res.status(400).send(error.message);
  }
};
