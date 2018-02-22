import React from 'react';

export const Toast = (props) => (
    <div id="toast">
        <p>{props.message}</p>
    </div>
)

export function showToast() {
    var x = document.getElementById("toast")
    x.className = "show";
    setTimeout(() => { x.className = x.className.replace("show", "");}, 5000);
}