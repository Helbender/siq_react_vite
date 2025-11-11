# Flight Processor Script

This script processes all flights from the database and sends them to Google Drive using the same logic as the API.

## Files Created

- `process_all_flights.py` - Main script that retrieves all flights and processes them
- `run_flight_processor.py` - Simple runner script for use with `uv run`
- `FLIGHT_PROCESSOR_README.md` - This documentation

## Usage

### Method 1: Direct Python execution
```bash
cd /home/tiago/Projects/siq_react_vite/api
source .venv/bin/activate
python process_all_flights.py
```

### Method 2: Using uv (Recommended)
```bash
cd /home/tiago/Projects/siq_react_vite/api
uv run process_all_flights.py
```

### Method 3: Using the runner script
```bash
cd /home/tiago/Projects/siq_react_vite/api
uv run run_flight_processor.py
```

## What the Script Does

1. **Retrieves all flights** from the database with all related data (pilots, crew, qualifications)
2. **Processes in batches** (50 flights at a time) to avoid memory issues
3. **Converts each flight** to JSON format (same as API)
4. **Generates file names** using the same logic as the API
5. **Sends to Google Drive** using `tarefa_enviar_para_drive` function
6. **Provides detailed logging** of the process
7. **Shows summary** of successful/failed operations

## Key Fixes Applied

- **Fixed lazy loading issue**: Added proper `joinedload` for pilot and crew qualifications
- **Batch processing**: Processes flights in batches of 50 to prevent memory issues
- **Better error handling**: Individual flight failures don't stop the entire process

## Output Example

```
🚀 Starting flight processing to Google Drive...
📅 Started at: 2024-01-15 14:30:25
------------------------------------------------------------
📊 Retrieving flights from database...
📋 Found 25 flights to process
------------------------------------------------------------

[1/25] Processing flight 123 (00A1731) - 2024-01-15
  Files: 1M 00A1731 15Jan2024 12:05.1m, 1M 00A1731 15Jan2024 12:05.pdf
  ✅ Successfully processed flight 123

[2/25] Processing flight 124 (00A1732) - 2024-01-15
  Files: 1M 00A1732 15Jan2024 13:30.1m, 1M 00A1732 15Jan2024 13:30.pdf
  ✅ Successfully processed flight 124

...

============================================================
📊 PROCESSING SUMMARY
============================================================
✅ Successfully processed: 25 flights
❌ Failed: 0 flights
📅 Completed at: 2024-01-15 14:32:10

🎉 All flights processed successfully!
```

## Requirements

- Virtual environment must be activated (or use `uv run`)
- Database connection must be configured
- Google Drive credentials must be set up
- All dependencies from `pyproject.toml` must be installed

## Error Handling

- Individual flight failures won't stop the entire process
- Detailed error messages for each failed flight
- Final summary shows success/failure counts
- Script exits with error code if any flights fail

## Notes

- Uses the same database queries as the API (`flight_blueprint.py`)
- Uses the same Google Drive upload logic as the API
- Processes flights in reverse chronological order (newest first)
- Thread-safe and can be run multiple times safely
