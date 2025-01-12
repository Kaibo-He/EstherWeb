import React, { useState } from 'react';
import '../admin/admin.css'

const Dropdown = ({ options, onSelect, placeholder}) => {
    const [isOpen, setIsOpen] = useState(false); // 控制下拉菜单是否展开
    const [selected, setSelected] = useState(null); // 存储选中的值

    const handleOptionClick = (option) => {
        setSelected(option); // 更新选中值
        onSelect(option); // 调用父组件传递的回调
        setIsOpen(false); // 收起下拉菜单
    };

    return (
        <div className="dropdown-container">
            {/* 触发下拉菜单的按钮 */}
            <button
                className="dropdown-button"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                {selected ? selected.title : placeholder}
            </button>

            {/* 下拉选项 */}
            {isOpen && (
                <ul
                    className="dropdown-menu"
                >
                    {options.map((option) => (
                        <li
                            key={option.id}
                            className="dropdown-item"
                            onClick={() => handleOptionClick(option)}
                        >
                            {option.title}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dropdown;
