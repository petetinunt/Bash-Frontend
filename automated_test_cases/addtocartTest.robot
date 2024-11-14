*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${URL}         http://localhost:3000/
${MENU_ITEM}   Latte
${EXPECTED_COUNT_ALL}  47
${POPUP_MESSAGE}  Item added to cart successfully!

*** Keywords ***
Open Browser To Website
    [Documentation]  Open the browser and navigate to the website.
    Open Browser    ${URL}    Chrome
    Maximize Browser Window

Verify All Items Show
    [Arguments]    ${expected_count}
    [Documentation]  Checks that the displayed matching count equals the provided expected value.
    Wait Until Element Is Visible    id=matchedNumber    timeout=5s
    ${count}=    Get Text    id=matchedNumber
    Should Be Equal As Numbers    ${count}    ${expected_count}

Scroll To Latte Product
    Wait Until Element Is Visible    id=Card    timeout=5s
    Execute JavaScript    document.getElementById('CardTitle').scrollIntoView();

Click Plus Button
    [Documentation]  Finds the card with the specified menu item title and clicks the + button.
    Wait Until Element Is Visible    xpath=//div[@id="Card" and .//h3[@id="CardTitle" and text()="${MENU_ITEM}"]]    timeout=5s
    Click Element    xpath=//div[@id="Card" and .//h3[@id="CardTitle" and text()="${MENU_ITEM}"]]//button[@id="Addbtn"]


Select Multiple Add-Ons
    [Documentation]  Selects multiple add-ons: Oat milk and Brown Sugar Jelly.
    Wait Until Element Is Visible    id=description-page    timeout=3s
    Click Element    xpath=//button[text()='Cold']
    Wait Until Element Is Visible    id=Options    timeout=1s
    Click Element    xpath=//button[contains(text(), 'Oat Milk')]
    Click Element    xpath=//button[contains(text(), 'Brown Sugar Jelly')]
    Click Element    xpath=//button[text()='100%']

Add To Cart
    Click Element    xpath=//button[text()='Add to Cart']

Check Popup
    [Documentation]  Verifies that the pop-up message appears and matches the expected text.
    Wait Until Element Is Visible    xpath=//p[contains(text(), '${POPUP_MESSAGE}')]    timeout=5s
    ${popup_text}=    Get Text    xpath=//p[contains(text(), '${POPUP_MESSAGE}')]
    Should Be Equal    ${popup_text}    ${POPUP_MESSAGE}
    Click Element    xpath=//button[text()='Close']

*** Test Cases ***
Test Valid Menu Item Search And Add To Cart
    Open Browser To Website
    Maximize Browser Window
    Verify All Items Show    ${EXPECTED_COUNT_ALL}
    Scroll To Latte Product
    Click Plus Button
    Select Multiple Add-Ons
    Add To Cart
    Check Popup
    Close Browser






