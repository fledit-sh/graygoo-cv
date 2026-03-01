# Launching the Graygoo CV application

The desktop app entry point is `application/entrypoint.py` (also wrapped by `main.py`).

## Quick start

From the repository root:

```bash
python main.py
```

Equivalent direct command:

```bash
python application/entrypoint.py
```

## Windows example (like your current setup)

```powershell
C:\Users\NoelErnstingLuz\AppData\Local\Python\bin\python.exe C:\Users\NoelErnstingLuz\PycharmProjects\graygoo-cv\application\entrypoint.py
```

## Optional startup arguments

The entrypoint supports these flags:

- `--document-path <path>`
- `--history-path <path>` *(requires `--document-path`)*
- `--settings-path <path>` *(requires `--document-path`)*
- `--save-document-path <path>`
- `--save-history-path <path>`

Example:

```bash
python main.py --document-path doc.json --history-path hist.json
```
