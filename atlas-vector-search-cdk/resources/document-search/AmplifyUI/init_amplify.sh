#!/bin/bash

# Run the amplify init command with expect
expect -c '
spawn amplify init

expect "? Enter a name for the project *"
send -- "AVSDOCAMPUI\r"

expect "? Initialize the project with the above configuration?* (Y/n)"
send -- "Y\r"

expect "? Select the authentication method you want to use:*"
send -- "AWS profile\r"

expect "? Please choose the profile you want to use:*"
send -- "default\r"

expect "? Help improve Amplify CLI by sharing non-sensitive project configurations on failures* (y/N)"
send -- "n\r"

# Wait for completion indication
expect {
    "Your project has been successfully initialized and connected to the cloud!" {
        send_user "Init Completed\n"
    }
    timeout {
        send_user "Init Failed\n"
    }
}

# Allow interaction with the terminal
interact
'
