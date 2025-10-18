import { getUserTimezone, getTimezoneOptions } from '../../utils/timezone';
import './TimezoneSelect.css';

const TimezoneSelect = ({ 
  value, 
  onChange, 
  showUserTimezone = false,
  disabled = false,
  className = ''
}) => {
  const userTimezone = getUserTimezone();
  const timezoneOptions = getTimezoneOptions();

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className={`timezone-select-wrapper ${className}`}>
      <select
        id="timezone-select"
        value={value || userTimezone}
        onChange={handleChange}
        disabled={disabled}
        className="timezone-select"
      >
        {showUserTimezone && (
          <optgroup label="Your Timezone">
            <option value={userTimezone}>
              {timezoneOptions.find(tz => tz.value === userTimezone)?.label || userTimezone}
            </option>
          </optgroup>
        )}
        
        <optgroup label="North America">
          {timezoneOptions
            .filter(tz => tz.value.startsWith('America/'))
            .map(tz => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))
          }
        </optgroup>

        <optgroup label="Europe">
          {timezoneOptions
            .filter(tz => tz.value.startsWith('Europe/'))
            .map(tz => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))
          }
        </optgroup>

        <optgroup label="Asia">
          {timezoneOptions
            .filter(tz => tz.value.startsWith('Asia/'))
            .map(tz => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))
          }
        </optgroup>

        <optgroup label="Pacific">
          {timezoneOptions
            .filter(tz => tz.value.startsWith('Pacific/'))
            .map(tz => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))
          }
        </optgroup>

        <optgroup label="Australia">
          {timezoneOptions
            .filter(tz => tz.value.startsWith('Australia/'))
            .map(tz => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))
          }
        </optgroup>

        <optgroup label="Other">
          <option value="UTC">UTC</option>
        </optgroup>
      </select>
    </div>
  );
};

export default TimezoneSelect;