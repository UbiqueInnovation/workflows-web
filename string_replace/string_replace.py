import os
import yaml
import re

def perform_edit(filename, pattern, replace):
  with open(filename, 'r+') as file:
    file_contents = file.read()
    text_pattern = re.compile(pattern)
    file_contents = text_pattern.sub(replace, file_contents)
    file.seek(0)
    file.truncate()
    file.write(file_contents)

REPLACEMENT_FILE = os.getenv('REPLACEMENT_FILE')
EDITS_DIR = os.getenv('EDITS_DIR')
PREFIX = ''

if REPLACEMENT_FILE == None:
  raise RuntimeError("Environment variable 'REPLACEMENT_FILE' not specified.")

if EDITS_DIR != None:
  PREFIX = EDITS_DIR

with open(REPLACEMENT_FILE, "r") as stream:
  try:
    yaml_content = yaml.safe_load(stream)
  except:
    raise 

for edit in yaml_content['edits']:
  path = os.path.abspath(os.path.join(PREFIX, edit['file']))
  try:
    perform_edit(path, edit['pattern'], edit['replace'])
  except:
    raise