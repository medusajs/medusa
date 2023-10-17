type FieldViewType = {
    title: string,
    children?: any
}

const FieldView = ({title, children}: FieldViewType) => {

    return(
        <div className="flex flex-col items-start flex-wrap">
            <div className="text-gray-500 text-xs">{title}:</div>
            <div className="break-all">{children}</div>
        </div>
    );

}

export default FieldView;