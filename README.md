# LicenseGenie

## Description

LicenseGenie is a command-line tool to generate open-source licenses for your projects. It comes with built-in support for common licenses like MIT, Apache 2.0, and GPL 3.0, and also allows users to add their custom license templates.

## Installation

```bash
npm install -g licensegenie
```

## Usage

After installing, you can generate a license by simply running:

```bash
licensegenie
```

You'll be prompted to choose a license from a list and, depending on the license you choose, you may be asked to provide the copyright holder's name.

The license will be saved in the current directory with the filename `LICENSE`.

## Configuration

You can customize LicenseGenie by adding a configuration file located at `~/.config/licensegenie/config.json`.

### Sample Configuration

Here's a sample `config.json` file:

```json
{
  "customLicenses": ["MyCustomLicense1", "MyCustomLicense2"],
  "licenseMetadata": {
    "MyCustomLicense1": {
      "requiresName": true
    },
    "MyCustomLicense2": {
      "requiresName": false
    }
  },
  "customLicenseDir": "/path/to/custom/licenses"
}
```

### Configuration Fields

- `customLicenses`: An array of strings specifying the names of the custom licenses.
- `licenseMetadata`: An object where each key is a custom license name and the value is an object with additional metadata.
  - `requiresName`: A boolean that indicates whether the license requires a copyright holder's name.
- `customLicenseDir`: The directory where your custom license templates are stored. Each license should be a text file with the name format: `LicenseName.txt`.

## Adding Custom Licenses

To add a custom license, create a text file in your specified `customLicenseDir`. Use placeholders like `[year]` and `[name]` in the license text, which will be replaced when generating the license.
