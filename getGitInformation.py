import json;
import os;
import subprocess
import sys;
import zlib;

def write_as_js(var_name, var, f):
  f.write('var ' + var_name + ' = ' + json.dumps(var) + ';\n')

p = subprocess.Popen("find .git/objects -type f",
                     stdout=subprocess.PIPE,
                     shell=True)
(output, err) = p.communicate()
files = output.split('\n')
files.pop()

git_objects = {}
commits = []
for file in files:
  file_info = {}
  file_info['git_hash'] = file[13:15] + file[16:]
  file_info['file_name'] = file

  with open(file, 'r') as f:
    file_info['contents'] = repr(zlib.decompress(f.read()))
  if file_info['contents'][1:7] == 'commit':
    commits.append(file_info['git_hash'])
  p = subprocess.Popen(["git", "cat-file", "-p", file_info['git_hash']],
                       stdout=subprocess.PIPE)
  (output, err) = p.communicate()
  file_info['meaning'] =  output
  git_objects[file_info['git_hash']] = file_info

with open('data.js', 'w') as f:
  write_as_js('gitObjects', git_objects, f)
  write_as_js('commits', commits, f)

