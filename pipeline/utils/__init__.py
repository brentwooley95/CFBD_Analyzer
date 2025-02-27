import yaml
import os
import unicodedata


def load_config(file_path="config.yaml"):
    file_path = os.path.abspath(file_path)
    """
    Load configuration from a YAML file.

    :param file_path: Path to the configuration file.
    :return: Dictionary containing configuration data.
    """
    try:
        with open(file_path, 'r') as yaml_file:
            return yaml.safe_load(yaml_file)
    except FileNotFoundError:
        raise FileNotFoundError(f"Configuration file not found: {file_path}")
    except yaml.YAMLError as e:
        raise ValueError(f"Error parsing YAML file: {e}")


def clean_float(value):
    """
    Cleans and formats a value:
    - Removes leading single quotes (').
    - Converts to float.
    - Rounds to 4 decimal places.

    :param value: The value to clean and convert to a float.
    :return: Cleaned float value or None if conversion fails.
    """
    try:
        cleaned_value = float(str(value).lstrip("'"))
        return round(cleaned_value, 4)
    except (ValueError, TypeError):
        return None


def clean_string(value):
    """
    Cleans and formats a string:
    - Decodes Unicode escape sequences.
    - Strips unwanted leading/trailing whitespace or special characters.

    :param value: The string to clean.
    :return: Cleaned string or None if input is not a string.
    """
    if not isinstance(value, str):
        return None

    try:
        # Normalize Unicode characters to avoid encoding issues
        value = unicodedata.normalize("NFKC", value)
    except (UnicodeEncodeError, UnicodeDecodeError):
        pass  # Leave the string as-is if decoding fails

    return value.strip()


def parse_years(years):
    """
    Parse a year range in 'YYYY-YYYY' format into start and end years.

    :param years: A string in the format 'YYYY-YYYY'.
    :return: Tuple (start_year, end_year).
    :raises ValueError: If the input format is invalid.
    """
    try:
        start_year, end_year = map(int, years.split("-"))
        return start_year, end_year
    except ValueError:
        raise ValueError("Invalid format for year range. Use 'YYYY-YYYY'.")


def log_message(message):
    """
    Utility function to log messages to the console (can be extended for logging to files).

    :param message: The message to log.
    """
    print(f"[LOG] {message}")
