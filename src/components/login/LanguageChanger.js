import React from 'react';

const LanguageChanger = ({changeLanguage, t}) => {
    return (
        <div>
            <div style={{textAlign: "center", marginBottom: "10px"}}>
                <h4>{t("chooseLanguage")}:</h4>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px"}}>
                <span style={{ display: "inline-block", marginRight: "10px", cursor: "pointer"}} className="flag-icon flag-icon-gb" onClick={() => changeLanguage('en')}/>
                <span style={{ display: "inline-block", marginLeft: "10px", cursor: "pointer"}} className="flag-icon flag-icon-pl" onClick={() => changeLanguage('pl')}/>
            </div>
        </div>
    );
};

export default LanguageChanger;