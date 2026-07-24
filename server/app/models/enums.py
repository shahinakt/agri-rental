import enum


class UserRole(str, enum.Enum):
    OWNER = "owner"
    FARMER = "farmer"


class EquipmentCategory(str, enum.Enum):
    TRACTOR = "tractor"
    HARVESTER = "harvester"
    ROTAVATOR = "rotavator"
    SEEDER = "seeder"
    POWER_TILLER = "power_tiller"
    CULTIVATOR = "cultivator"
    SPRAYER = "sprayer"


class BookingStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
