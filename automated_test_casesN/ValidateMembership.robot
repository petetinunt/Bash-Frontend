*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${URL}                  http://localhost:3000/paymentpage
${VALIDMEMBERSHIP}      0123456789
${INVALIDMEMBERSHIP}    888888888
${MEMBERSHIP_INPUT}     //input[@placeholder='08X-XXX-XXXX']
${CHECK_BUTTON}         //button[contains(@class, 'checkMembershipButton')]
${POINT_ELEMENT}        //span[contains(@class, 'membershipScore')]
${INVALID_MESSAGE}      //span[contains(@class, 'membershipInvalid')]

*** Keywords ***
Open Payment Page
    Open Browser    ${URL}    Chrome
    Maximize Browser Window
    Wait Until Element Is Visible    ${MEMBERSHIP_INPUT}    timeout=10s

Input Membership Number
    [Arguments]    ${membership_number}
    Input Text    ${MEMBERSHIP_INPUT}    ${membership_number}

Click Membership Apply Button
    Click Element    ${CHECK_BUTTON}

*** Test Cases ***
Check Validate Membership
    [Setup]    Open Payment Page
    Input Membership Number    ${VALIDMEMBERSHIP}
    Click Membership Apply Button
    Wait Until Element Is Visible    ${POINT_ELEMENT}    timeout=10s
    ${points}=    Get Text    ${POINT_ELEMENT}
    Log    Points displayed: ${points}
    Sleep    2s
    Close Browser

Check Invalidate Membership
    [Setup]    Open Payment Page
    Input Membership Number    ${INVALIDMEMBERSHIP}
    Click Membership Apply Button
    Wait Until Element Is Visible    ${INVALID_MESSAGE}    timeout=10s
    ${message}=    Get Text    ${INVALID_MESSAGE}
    Log    Message displayed: ${message}
    Should Be Equal    ${message}    Membership invalid
    Sleep    2s
    Close Browser
