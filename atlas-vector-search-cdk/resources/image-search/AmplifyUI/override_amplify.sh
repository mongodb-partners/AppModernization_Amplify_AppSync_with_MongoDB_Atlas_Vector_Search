#!/bin/bash

# Run the amplify add auth command with expect
expect -c "
set timeout 20
spawn amplify override project
expect \"? Do you want to edit override.ts file now?*\"
send -- \"No\r\"
interact
"
