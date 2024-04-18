import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import {Task} from "../models/taskSchema.js";


export const createTask = catchAsyncErrors(async(req, res, next)=> {
    const {title, description} = req.body;
    const createdBy = req.user._id;
    const task = await Task.create({
        title,
        description,
        createdBy,
    });
    res.status(200).json({
        success: true,
        task,
        message: "Task Created",
    });
});
export const deleteTask = catchAsyncErrors(async(req, res, next)=> {
    const {id} = req.params;
    const task = await Task.findById(id);
    if(!task){
        return next(new ErrorHandler("task not found", 400));
    }
    await task.deleteOne();
    res.status(200).json({
        success: true,
        message: "Task deleted"
    });
});
export const updateTask = catchAsyncErrors(async(req, res, next)=> {
    const {id} = req.params;
    let task = await Task.findById(id);
    if(!task){
        return next(new ErrorHandler("task not found", 400));
    }
    task = await Task.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
        message: "Task updated",
        task,
    });
});
export const getMyTask = catchAsyncErrors(async(req, res, next)=> {
    const user = req.user._id;
    const tasks = await Task.find({createdBy: user});
    res.status(200).json({
        success: true,
        tasks,
    })
});
export const getSingleTask = catchAsyncErrors(async(req, res, next)=> {
    const {id} = req.params;
    let task = await Task.findById(id);
    if(!task){
        return next(new ErrorHandler("task not found", 400));
    }
    res.status(200).json({
        success: true,
        task,
    })
});

