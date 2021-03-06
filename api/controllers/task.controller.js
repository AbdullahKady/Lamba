var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Task = mongoose.model('Task'),
  Comment = mongoose.model('Comment'),
  Child = mongoose.model('Child'),
  Validations = require('../utils/validations');

module.exports.createNewTask = function(req, res, next) {

  if (!Validations.isObjectId(req.body.studentId)) {
    return res.status(422).json({
      err: null,
      msg: 'ChildId parameter must be a valid ObjectId.',
      data: null
    });
  };

  Child.findById(req.body.studentId).exec(function(err, child) {
    if (err) {
      return next(err);
    }
    if (!child) {
      return res
        .status(404)
        .json({
          err: null,
          msg: 'Child not found.',
          data: null
        });
    }

    User.findById(req.decodedToken.user._id).exec(function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res
          .status(404)
          .json({
            err: null,
            msg: 'User not found.',
            data: null
          });
      }

      if (user.role === 'Parent' && req.decodedToken.user._id !== child.parent_id) {

        return res
          .status(401)
          .json({
            err: null,
            msg: 'Unauthorized action.',
            data: null
          });

      } else if (user.role === 'Teacher') {

        var arraycontainsturtles = (user.students.indexOf(req.body.studentId) > -1);


        if(!arraycontainsturtles)
        {
              return res
                .status(401)
                .json({
                  err: null,
                  msg: 'This child is not in your list of students.',
                  data: null
                });
        }

      }

      Task.create(req.body, function(err, task) {
        if (err) {
          return next(err);
        }
        res.status(201).json({
          err: null,
          msg: 'Task was created successfully.',
          data: task
        });
      });
    });
  });
}

module.exports.createNewComment = function(req, res, next) {

  if (!Validations.isObjectId(req.decodedToken.user._id)) {
    return res.status(422).json({
      err: null,
      msg: 'userId parameter must be a valid ObjectId.',
      data: null
    });
  };

  Task.findById(req.body.taskId).exec(function(err, task) {
    if (err) {
      return next(err);
    }
    if (!task) {
      return res
        .status(404)
        .json({
          err: null,
          msg: 'Task not found.',
          data: null
        });
    }

    User.findById(req.decodedToken.user._id).exec(function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        Child.findById(req.decodedToken.user._id).exec(function(err, child) {
          if (err) {
            return next(err);
          }
          if (!child) {
            return res
              .status(404)
              .json({
                err: null,
                msg: 'Child not found.',
                data: null
              });
          }
          if (task.studentId !== req.decodedToken.user._id) {
            return res
              .status(401)
              .json({
                err: null,
                msg: 'Unauthorized action.',
                data: null
              });
          }
        });
      } else {
        if (user.role === 'Parent') {

          Child.findById(task.studentId).exec(function(err, child2) {
            if (err) {
              return next(err);
            }
            if (!child2) {
              return res
                .status(401)
                .json({
                  err: null,
                  msg: 'The child of the task not found.',
                  data: null
                });
            }

            if (child2.parent_id !== req.decodedToken.user._id) {
              return res
                .status(401)
                .json({
                  err: null,
                  msg: 'Unauthorized action.',
                  data: null
                });
            }


          });

        } else if (user.role === 'Teacher' && task.userId !== req.decodedToken.user._id) {
          return res
            .status(401)
            .json({
              err: null,
              msg: 'This child is not in your list of students.',
              data: null
            });
        }

      }
    });

    if (!req.body.role) {
      req.body.role = 'Child';
    }

    const com = {
      comment: req.body.comment,
      userId: req.decodedToken.user._id,
      role: req.body.role
    }

    Comment.create(com, function(err, comment) {
      if (err) {
        return next(err);
      }

      task.comments.push(comment);

      task.save(function(err) {
        if (err) {
          return next(err);
        }
        res.status(201).json({
          err: null,
          msg: 'Comment was created successfully.',
          data: task
        });
      });
    });
  });
};

module.exports.getComments = function(req, res, next) {


  if (!Validations.isObjectId(req.decodedToken.user._id)) {
    return res.status(422).json({
      err: null,
      msg: 'userId parameter must be a valid ObjectId.',
      data: null
    });
  };

  Task.findById(req.params.taskId).exec(function(err, task) {
    if (err) {
      return next(err);
    }
    if (!task) {
      return res
        .status(404)
        .json({
          err: null,
          msg: 'Task not found.',
          data: null
        });
    }

    User.findById(req.decodedToken.user._id).exec(function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        Child.findById(req.decodedToken.user._id).exec(function(err, child) {
          if (err) {
            return next(err);
          }
          if (!child) {
            return res
              .status(404)
              .json({
                err: null,
                msg: 'Child not found.',
                data: null
              });
          }
          if (task.studentId !== req.decodedToken.user._id) {
            return res
              .status(401)
              .json({
                err: null,
                msg: 'Unauthorized action.',
                data: null
              });
          }
        });
      } else {
        if (user.role === 'Parent') {

          Child.findById(task.studentId).exec(function(err, child2) {
            if (err) {
              return next(err);
            }
            if (!child2) {
              return res
                .status(401)
                .json({
                  err: null,
                  msg: 'The child of the task not found.',
                  data: null
                });
            }

            if (child2.parent_id !== req.decodedToken.user._id) {
              return res
                .status(401)
                .json({
                  err: null,
                  msg: 'Unauthorized action.',
                  data: null
                });
            }


          });

        } else if (user.role === 'Teacher' && task.userId !== req.decodedToken.user._id) {
          return res
            .status(401)
            .json({
              err: null,
              msg: 'This child is not in your list of students.',
              data: null
            });
        }

      }
    });


    var ids = task.comments;

    Comment.find({
      _id: {
        $in: ids
      },
      role: {
        $eq: "Child"
      },
    }).populate({
      path: 'userId',
      select: 'name photo',
      model: Child
    }).exec((err, result) => {

      Comment.find({
        _id: {
          $in: ids
        },
        role: {
          $ne: "Child"
        },
      }).populate({
        path: 'userId',
        select: 'name photo',
        model: User
      }).exec((err, result2) => {

        var r = result2.concat(result);


        res.status(200).json({
          err: null,
          msg: 'Comments retrieved successfully.',
          data: r
        });
      });

    });

  });
};

module.exports.getTasks = function(req, res, next) {

  User.findById(req.decodedToken.user._id).exec(function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      Child.findById(req.decodedToken.user._id).exec(function(err, child) {
        if (err) {
          return next(err);
        }
        if (!child) {
          return res
            .status(404)
            .json({
              err: null,
              msg: 'Child not found.',
              data: null
            });
        }


        Task.find({
          studentId: { //might need changing depending on saleh's schema
            $eq: req.decodedToken.user._id
          }
        }).populate({
          path: 'userId',
          select: 'name _id',
          model: User
        }).populate({
          path: 'studentId',
          select: 'name _id',
          model: Child
        }).exec(function(err, tasks) {
          if (err) {
            return next(err);
          }
          return res.status(200).json({
            err: null,
            msg: 'Requests received successfully.',
            data: tasks

          });
        });

      });
    } else {
      Task.find({
        userId: { //might need changing depending on saleh's schema
          $eq: req.decodedToken.user._id
        }
      }).populate({
        path: 'userId',
        select: 'name _id',
        model: User
      }).populate({
        path: 'studentId',
        select: 'name _id',
        model: Child
      }).exec(function(err, tasks) {
        if (err) {
          return next(err);
        }
        return res.status(200).json({
          err: null,
          msg: 'Requests received successfully.!',
          data: tasks

        });
      });

    }
  });
};

module.exports.getChildTasks = function(req, res, next) {

  User.findById(req.decodedToken.user._id).exec(function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {

      return res
        .status(404)
        .json({
          err: null,
          msg: 'User not found.',
          data: null
        });


    }

    if (req.decodedToken.user.role !== 'Parent') {
      return res
        .status(401)
        .json({
          err: null,
          msg: 'Unauthorized access.',
          data: null
        });

    }

    Task.find({
      studentId: { //might need changing depending on saleh's schema
        $eq: req.params.ChildId
      }
    }).populate({
      path: 'userId',
      select: 'name _id',
      model: User
    }).populate({
      path: 'studentId',
      select: 'name _id',
      model: Child
    }).exec(function(err, tasks) {
      if (err) {
        return next(err);
      }
      return res.status(200).json({
        err: null,
        msg: 'Requests received successfully.',
        data: tasks

      });
    });


  });

};

module.exports.getTask = function(req, res, next) {

  if (!Validations.isObjectId(req.params.taskId)) {
    return res.status(422).json({
      err: null,
      msg: 'taskId parameter must be a valid ObjectId.',
      data: null
    });
  };

  Task.findById(req.params.taskId).exec(function(err, task) {
    if (err) {
      return next(err);
    }
    if (!task) {
      return res
        .status(404)
        .json({
          err: null,
          msg: 'Task not found.',
          data: null
        });
    }

    User.findById(req.decodedToken.user._id).exec(function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        Child.findById(req.decodedToken.user._id).exec(function(err, child) {
          if (err) {
            return next(err);
          }
          if (!child) {
            return res
              .status(404)
              .json({
                err: null,
                msg: 'Child not found.',
                data: null
              });
          }
          if (task.studentId !== req.decodedToken.user._id) {
            return res
              .status(401)
              .json({
                err: null,
                msg: 'Unauthorized action.',
                data: null
              });
          }
        });
      } else {
        if (user.role === 'Parent') {

          Child.findById(task.studentId).exec(function(err, child2) {
            if (err) {
              return next(err);
            }
            if (!child2) {
              return res
                .status(401)
                .json({
                  err: null,
                  msg: 'The child of the task not found.',
                  data: null
                });
            }

            if (child2.parent_id !== req.decodedToken.user._id) {
              return res
                .status(401)
                .json({
                  err: null,
                  msg: 'Unauthorized action.',
                  data: null
                });
            }


          });

        } else if (user.role === 'Teacher' && task.userId !== req.decodedToken.user._id) {
          return res
            .status(401)
            .json({
              err: null,
              msg: 'This child is not in your list of students.',
              data: null
            });
        }

      }
    });





    Task.findById(req.params.taskId).exec(function(err, task) {
      if (err) {
        return next(err);
      }
      res.status(200).json({
        err: null,
        msg: 'Requests received successfully.',
        data: task
      });
    });
  });
};
module.exports.getTeacher = function(req, res, next) {
  let id = req.params.TeacherId;
  User.findById(id).exec(function(err, user) {
    if (err) {
      return next(err);
    }
    res.status(200).json({
      err: null,
      msg: 'Requests recieved successfully.',
      data: user.name

    });
  });

};

module.exports.markAsDone = function(req,res,next){
  Task.findByIdAndRemove(req.params.taskID).exec(function(err, task) {
    if (err) {
      return next(err);
    }
    res.status(200).json({
      err: null,
      msg:'Task removed successfully.',
      data: task
    });
  });
};
