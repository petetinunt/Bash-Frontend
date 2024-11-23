*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${URL}             http://localhost:3000/
${CART_URL}        http://localhost:3000/cart
${MENU_ITEM}       Dirty
${DELAY}           1s
${TIMEOUT}         10s

*** Keywords ***
Open Browser To Website
    [Documentation]  Open the browser and navigate to the website
    Open Browser    ${URL}    Chrome
    Maximize Browser Window

Add to cart
    [Documentation]  Add beverage to cart page
    Click Element    xpath=//div[@id="Card" and .//h3[@id="CardTitle" and text()="${MENU_ITEM}"]]//button[@id="Addbtn"]
    Wait Until Element Is Visible    id=description-page    timeout=${TIMEOUT}
    Click Element    xpath=//button[text()='Add to Cart']
    Sleep    ${DELAY}

Go To Cart Page
    [Documentation]  navigates to the cart page.
    Go To    ${CART_URL}
    Wait Until Page Contains Element    xpath=//div[contains(@class, 'itemContainer')]    timeout=${TIMEOUT}
    Sleep    ${DELAY}

Increase Quantity
    [Documentation]  Increases the quantity of the specified cart item by clicking the + button.
    Wait Until Element Is Visible    xpath=//div[contains(@class, 'itemContainer')]    timeout=${TIMEOUT}
    Click Element    xpath=//div[contains(@class, 'itemContainer')]//button[text()='+']
    Sleep    ${DELAY}

Verify Increased Quantity
    [Documentation]  Verifies that the quantity of the specified cart item has increased.
     Wait Until Page Contains Element    xpath=//div[contains(@class, 'itemContainer')]//button[text()='+']/preceding-sibling::span    timeout=${TIMEOUT}
    ${increased_quantity}=    Get Text    xpath=//div[contains(@class, 'itemContainer')]//button[text()='+']/preceding-sibling::span
    Should Be Equal As Numbers          ${increased_quantity}    2

Decrease Quantity
    [Documentation]  Decreases the quantity of the specified cart item by clicking the - button.
    Wait Until Element Is Visible    xpath=//div[contains(@class, 'itemContainer')]    timeout=${TIMEOUT}
    Click Element    xpath=//div[contains(@class, 'itemContainer')]//button[text()='-']
    Sleep    ${DELAY}

Verify Decreased Quantity
    [Documentation]  Verifies that the quantity of the specified cart item has decreased.
    Wait Until Page Contains Element    xpath=//div[contains(@class, 'itemContainer')]//button[text()='+']/preceding-sibling::span    timeout=${TIMEOUT}
    ${decreased_quantity}=    Get Text    xpath=//div[contains(@class, 'itemContainer')]//button[text()='+']/preceding-sibling::span
    Should Be Equal As Numbers          ${decreased_quantity}    1

*** Test Cases ***
Test Add To Cart And Increase Quantity
    [Documentation]  Test case to add a menu item to the cart and verify the quantity increase.
    Open Browser To Website
    Maximize Browser Window
    Add to cart
    Go To Cart Page
    Increase Quantity
    Verify Increased Quantity
    Close Browser

Test Add To Cart And Decrease Quantity
    [Documentation]  Test case to add a menu item to the cart and verify the quantity decrease.
    Open Browser To Website
    Maximize Browser Window
    Add to cart
    Go To Cart Page
    Increase Quantity
    Verify Increased Quantity
    Decrease Quantity
    Verify Decreased Quantity
    Close Browser
