import express from 'express';
import {dataController} from "../controller/data-controller.js";

const router = express.Router();

router.get("/tasks", dataController.getTasks);
router.post("/tasks", dataController.addTask);
router.delete("/tasks/:id", dataController.deleteTask)
router.get("/tasks/:id", dataController.getTaskById);
router.put("/tasks/:id", dataController.update);

export const routes = router;
