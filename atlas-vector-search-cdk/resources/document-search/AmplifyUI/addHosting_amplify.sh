#!/bin/bash

# Run the amplify add hosting command with expect
expect << EOF
spawn amplify add hosting
expect "Select the plugin module to execute"
send -- "Hosting with Amplify Console (Managed hosting with custom domains, Continuous deployment)\r"
expect "Choose a type"
send -- "Manual deployment\r"
expect eof
EOF
