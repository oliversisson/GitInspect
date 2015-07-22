Git Inspect. 

Let's you inspect the files created by Git in the .git/objects/ directory. Each file represents a snapshot of a file in your repo, a tree or a commit. Git Inspect opens these files up and let's you follow the links around.

Each commit refers to a tree and, if it exists, its parent or parents (in the case of a merge).

Each tree represents a directory. Each refers to blobs and trees.

Each blob represents a snapshot of a file in your repo.

To do:

- represent merges in some way; and
- sort the commits in reverse-chronological order.

