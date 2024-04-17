#!/bin/bash

# Run the amplify add auth command with expect
expect -c "
spawn amplify add auth
expect \"? Do you want to use the default authentication and security configuration?*\"
send -- \"1\r\"
expect \"How do you want users to be able to sign in?*\"
send -- \"2\r\"
expect \"? Do you want to configure advanced settings?*\"
send -- \"1\r\"
interact
"
