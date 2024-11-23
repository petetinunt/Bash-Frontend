*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${URL}                 http://localhost:3000/
${CART_URL}            http://localhost:3000/cart
${PAYMENT_URL}         http://localhost:3000/paymentpage
${VALIDMEMBERSHIP}     0625916127
${MEMBERSHIP_INPUT}    //input[@placeholder='08X-XXX-XXXX']
${CHECK_BUTTON}        //button[contains(@class, 'checkMembershipButton')]
${MENU_ITEM}           Dirty
${DELAY}               1s
${TIMEOUT}             30s

*** Keywords ***
Open Browser To Website
    [Documentation]  Open the browser and navigate to the website.
    Create WebDriver    Chrome
    Go To    ${URL}
    Maximize Browser Window

Add to cart
    [Documentation]  Add beverage to cart page.
    Click Element    xpath=//div[@id="Card" and .//h3[@id="CardTitle" and text()="${MENU_ITEM}"]]//button[@id="Addbtn"]
    Wait Until Element Is Visible    id=description-page    timeout=${TIMEOUT}
    Click Element    xpath=//button[text()='Add to Cart']
    Sleep    ${DELAY}

Go To Cart Page
    [Documentation]  Navigates to the cart page.
    Go To    ${CART_URL}
    Wait Until Page Contains Element    xpath=//div[contains(@class, 'itemContainer')]    timeout=${TIMEOUT}
    Sleep    ${DELAY}

Go To Payment Page
    [Documentation]  Navigates to the payment page and handles button click interception.
    Go To    ${PAYMENT_URL} 
    Wait Until Element Is Visible    ${MEMBERSHIP_INPUT}    timeout=${TIMEOUT}
    Input Text    ${MEMBERSHIP_INPUT}    ${VALIDMEMBERSHIP}
    Sleep    ${DELAY}

Click Membership Apply Button
    Execute JavaScript    window.scrollBy(0, 300)
    Click Element    ${CHECK_BUTTON}

Click LineOA Promotion Button
    [Documentation]  Click Line OA Promotion Button.
    Wait Until Page Contains Element    xpath=//div[contains(@class, 'paymentpage_promotionContent__86aeZ') and .//span[contains(text(),'สะสมแต้มผ่าน LINE OA 10 แก้ว ฟรี 1 แก้ว')]]    timeout=${TIMEOUT}
    Scroll Element Into View           xpath=//div[contains(@class, 'paymentpage_promotionContent__86aeZ') and .//span[contains(text(),'สะสมแต้มผ่าน LINE OA 10 แก้ว ฟรี 1 แก้ว')]]
    Wait Until Element Is Visible      xpath=//div[contains(@class, 'paymentpage_promotionContent__86aeZ') and .//span[contains(text(),'สะสมแต้มผ่าน LINE OA 10 แก้ว ฟรี 1 แก้ว')]]    timeout=${TIMEOUT}
    Click Element                      xpath=//div[contains(@class, 'paymentpage_promotionContent__86aeZ') and .//span[contains(text(),'สะสมแต้มผ่าน LINE OA 10 แก้ว ฟรี 1 แก้ว')]]

Click StudentDiscount Promotion Button
    [Documentation]  Click Student Discount Promotion Button.
    Wait Until Page Contains Element    xpath=//div[contains(@class, 'paymentpage_promotionContent__86aeZ') and .//span[contains(text(),'ส่วนลด 5 บาทสำหรับนักศึกษาเก่ามหิดล')]]    timeout=${TIMEOUT}
    Scroll Element Into View           xpath=//div[contains(@class, 'paymentpage_promotionContent__86aeZ') and .//span[contains(text(),'ส่วนลด 5 บาทสำหรับนักศึกษาเก่ามหิดล')]]
    Wait Until Element Is Visible      xpath=//div[contains(@class, 'paymentpage_promotionContent__86aeZ') and .//span[contains(text(),'ส่วนลด 5 บาทสำหรับนักศึกษาเก่ามหิดล')]]    timeout=${TIMEOUT}
    Click Element                      xpath=//div[contains(@class, 'paymentpage_promotionContent__86aeZ') and .//span[contains(text(),'ส่วนลด 5 บาทสำหรับนักศึกษาเก่ามหิดล')]]

*** Test Cases ***
Test Used Membership and LineOA promotion
    [Documentation]  Test Used Membership and LineOA promotion.
    Open Browser To Website
    Add to Cart
    Go To Cart Page
    Go To Payment Page
    Click Membership Apply Button
    Click LineOA Promotion Button
    Sleep    3s
    Close Browser


Test Used Membership and StudentDiscount promotion
    [Documentation]  Test Used Membership and StudentDiscount promotion.
    Open Browser To Website
    Add to Cart
    Go To Cart Page
    Go To Payment Page
    Click Membership Apply Button
    Click StudentDiscount Promotion Button
    Sleep    3s
    Close Browser