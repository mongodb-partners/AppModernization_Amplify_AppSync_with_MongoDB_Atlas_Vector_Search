#!/bin/bash

# Run the amplify add auth command with expect
expect -c "
spawn amplify override project
expect \"? Do you want to edit override.ts file now?*\"
send -- \"No\r\"
interact
"
