#!/bin/bash

rsync -a ../notes/backend/api/ api/notes
rsync -a ../todo-list/backend/api/ api/todo-list
