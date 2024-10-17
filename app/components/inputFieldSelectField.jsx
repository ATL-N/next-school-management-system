export const InputField = ({
  label,
  name,
  type = "text",
  icon,
  value,
  onChange,
  placeholder,
  title = " ",
  isRequired = true,
  isReadOnly = false,
  min,
  max,
}) => (
  <div className="text-cyan-600">
    <label
      className="block text-sm font-medium text-gray-700 mb-2"
      htmlFor={name}
    >
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        id={name}
        required={isRequired}
        readOnly={isReadOnly}
        className={`pl-10 w-full p-2 border rounded-md focus:outline-none ${
          isReadOnly
            ? "bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed"
            : "border-gray-300 focus:ring-cyan-500 focus:border-cyan-500"
        }`}
        placeholder={placeholder}
        value={value}
        title={title}
        onChange={onChange}
        min={min}
        max={max}
      />
    </div>
  </div>
);
export const SelectField = ({
  label,
  name,
  icon,
  value,
  onChange,
  options,
  title = " ",
  isRequired = true,
  isReadOnly = false,
  isDisAbled = false
}) => (
  <div>
    <label
      className="block text-sm font-medium text-gray-700 mb-2"
      htmlFor={name}
    >
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 text-cyan-600 flex items-center pointer-events-none">
        {icon}
      </div>
      <select
        name={name}
        id={name}
        required={isRequired}
        readOnly={isReadOnly}
        disabled={isDisAbled}
        className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
        value={value}
        onChange={onChange}
        title={title}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export const TextAreaField = ({
  label,
  name,
  icon,
  value,
  onChange,
  placeholder,
  isRequired = true,
  isReadOnly=false
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <textarea
        name={name}
        rows="3"
        className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={isRequired}
        readOnly={isReadOnly}
      ></textarea>
    </div>
  </div>
);
