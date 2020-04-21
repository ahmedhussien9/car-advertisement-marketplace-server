const router = require("express").Router();
const TodoService = require('../service/todoService');

// get all todos
router.get("/getAllTodos", (request, response) => {
   try {
  const res = await TodoService.getAll();
  response.send(res)
   } catch (error) {
      response.status(500).send({
        message: 'Internal server error',
      })
   }
});

router.get("/:userId", async (request, response) => {
  try {
    const res = await TodoService.userTodos(request.query, request.params);
    response.send({
      message: res
    })
  } catch (error) {
    response.send({
      message: error
    })
  }
});

//update todo for todo

router.put("/:userId/:todoId", async (request, response) => {
  try {
    const res =  await TodoService.update(request.body, request.params);
    response.send({
      message: res
    });
  } catch (error) {
    response.send({
      message: error
    });
  }
});

// create todo for user
router.post("/:userId", async (request, response) => {
  const userId = request.params.userId;
  const todo = new Todo({
    title: request.body.title,
    description: request.body.description,
    priority: request.body.priority,
    user: userId
  });
  await todo.save();
  response.send({
    message: "todo added success!"
  });
});

// delete todo for user

router.delete("/:userId/:todoId", async (request, response) => {
  let todoId = request.params.todoId;
  try {
    await Todo.findByIdAndRemove({ _id: todoId }, (error, todo) => {
      if (error) {
        throw new Error(error);
      } else {
        response.status(200).send({
          message: "Todo deleted succesfully",
          todo: todo
        });
      }
    });
  } catch (error) {
    response.status(500).send({
      message: "Internel server error"
    });
  }
});


module.exports = router;
