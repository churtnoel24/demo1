type ButtonColor = "blue" | "red" | "green" | "yellow";

function Button({buttonText, btnclr}: {buttonText: string, btnclr: ButtonColor}){

    const buttonColors: Record<ButtonColor, string> = {
        blue: "bg-blue-700",
        red: "bg-red-700",
        green: "bg-green-700",
        yellow: "bg-yellow-700",
        };

    return (
        <button className={`p-2 m-2 ${buttonColors[btnclr]} text-white rounded-lg`}>{buttonText}</button>
    )
}

export default Button;