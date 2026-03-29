import oracledb

def get_connection():
    return oracledb.connect(
        user="C##CLINIC",
        password="clinic123",
        host="localhost",
        port=1521,
        service_name="XE"
    )