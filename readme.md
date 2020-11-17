# Document Management System
Design and code a simple Document Management System (DMS).

# Entities
    1. Files
    2. Folders
    3. Users

# Personas
File or Folder User with full permissions for read/write/modify/delete his or her own files and folders.

# System rules or constraints
    1.Users own files and folders.
    2.Files can be present as is, or can be present in a folder. 
    3.One file can only be present in one folder. (It means there can be no files with same name and type in any of the folders owned by a particular user)
    4. Folders can only contain files. Cannot have nested folders.
    5.
# Assumptions
    1. Only one User for now.
    2. Roles and Permissions are not in the scope of this solution.

# Use cases:
    1. APP home screen - View all the files and folders owned by a user - Context - Home screen or Root
       1.1 - Solution
             Rest API to get all files of a user
             GET -> /users/files?userId='userId'&context='root'
             Response: Type JSON
             [{
                id: "123",
                name: "",
                type:"",
                size:"",
                createdDate: "",
                updatedDate: "",
                createdBy:"",
                updatedBy:"",
                encoding:"",
                owner:"",
                parent:"root"
             }]

    2. View all files inside a folder
     2.1 - Solution
             Rest API to get all files in a folder
             GET -> /users/files?userId='userId'&context='folderId'
             Response: Type JSON
             [{
                name: "",
                type:"",
                size:"",
                createdDate: "",
                updatedDate: "",
                createdBy:"",
                updatedBy:"",
                encoding:"",
                owner:"",
                parent:"folderId"
             }]
    3. User login
    4. Create file
    5. Create folder
    6. Move file from one folder to another folder
